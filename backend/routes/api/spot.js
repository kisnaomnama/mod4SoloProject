// backend/routes/api/users.js
const express = require('express')
// const { Op } = require('sequelize')
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Spot, Review, SpotImage, ReviewImage } = require('../../db/models');
// const { route } = require('./session');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { route } = require('./reviews');
// const { resource } = require('../../app');

const router = express.Router();

const validateSpot = [
    check('address')
        .exists({ checkFalsy: true })
        .isLength({ min: 4 })
        .withMessage('Street address is required'),
    check('city')
        .exists({ checkFalsy: true })
        .isLength({ min: 2 })
        .withMessage('Street address is required'),
    check('state')
        .exists({ checkFalsy: true })
        .isLength({ min: 2 })
        .withMessage('Street address is required'),
    check('country')
        .exists({ checkFalsy: true })
        .isLength({ min: 3 })
        .withMessage('Street address is required'),
    check('lat')
        .exists({ checkFalsy: true })
        .withMessage('Latitude is required')
        .isFloat({ min: -90, max: 90 })
        .withMessage('Latitude must be within -90 and 90'),
    check('lng')
        .exists({ checkFalsy: true })
        .withMessage('Longitude is required')
        .isFloat({ min: -180, max: 180 })
        .withMessage('Longitude must be within -180 and 180'),
    check('name')
        .exists({ checkFalsy: true })
        .withMessage('Name is required')
        .isLength({ max: 49 })
        .withMessage('Name must be less than 50 characters'),
    check('description')
        .exists({ checkFalsy: true })
        .isLength({ min: 3 })
        .withMessage('Description is required'),
    check('price')
        .exists({ checkFalsy: true })
        .isFloat({ gt: 0 })
        .withMessage('Price per day must be a positive number'),
];

const validateReview = [
    check('stars')
        .exists({ checkFalsy: true })
        .isInt({ min: 1, max: 5 })
        .withMessage('Stars must be an integer from 1 to 5'),
    check('review')
        .exists({ checkFalsy: true })
        .isLength({ min: 1 })
        .withMessage('Review text is required'),
];


const calculateAvgRating = (reviews) => {
    if (reviews.length === 0) return 'no ratings';
    const sum = reviews.reduce((acc, curr) => acc + curr.stars, 0);
    return sum / reviews.length;
};

const calculateReviewlength = (reviews) => {
    if (reviews.length) return 0
    return reviews.length
}


router.get('/', async (req, res) => {
    const spots = await Spot.findAll({
        include: [
            {
                model: Review
            }
        ]
    })

    const resultSpots = spots.map(spot => ({
        id: spot.id,
        ownerId: spot.ownerId,
        address: spot.address,
        city: spot.city,
        state: spot.state,
        country: spot.country,
        lat: spot.lat,
        lng: spot.lng,
        name: spot.name,
        description: spot.description,
        price: spot.price,
        createdAt: spot.createdAt,
        updatedAt: spot.updatedAt,
        avgRating: calculateAvgRating(spot.Reviews),
        previewImage: "image url"
    }));

    return res.json({ Spots: resultSpots })
})


router.get('/current', requireAuth, async (req, res) => {
    const spots = await Spot.findAll({
        where: {
            ownerId: req.user.id
        },
        include: [
            {
                model: Review
            }
        ]
    })

    const resultSpots = spots.map(spot => ({
        id: spot.id,
        ownerId: spot.ownerId,
        address: spot.address,
        city: spot.city,
        state: spot.state,
        country: spot.country,
        lat: spot.lat,
        lng: spot.lng,
        name: spot.name,
        description: spot.description,
        price: spot.price,
        createdAt: spot.createdAt,
        updatedAt: spot.updatedAt,
        avgRating: calculateAvgRating(spot.Reviews),
        previewImage: "image url"
    }));

    return res.json({ Spots: resultSpots })
});


router.get('/:spotId', async (req, res) => {
    const spot = await Spot.findOne({
        where: {
            id: req.params.spotId
        },
        include: [
            {
                model: Review
            },
            {
                attributes: ['id', 'url', 'preview'],
                model: SpotImage
            },
            {
                attributes: ['id', 'firstName', 'lastName'],
                model: User
            }
        ]
    })

    if (!spot) {
        res.status(404)
        return res.json({ message: "Spot couldn't be found" })
    }

    const resultSpots = {
        id: spot.id,
        ownerId: spot.ownerId,
        address: spot.address,
        city: spot.city,
        state: spot.state,
        country: spot.country,
        lat: spot.lat,
        lng: spot.lng,
        name: spot.name,
        description: spot.description,
        price: spot.price,
        createdAt: spot.createdAt,
        updatedAt: spot.updatedAt,
        numReviews: calculateReviewlength(spot.Reviews),
        avgRating: calculateAvgRating(spot.Reviews),
        SpotImages: spot.SpotImages,
        Owner: spot.User
    }

    return res.json(resultSpots)
})

router.post('/', requireAuth, validateSpot, handleValidationErrors, async (req, res) => {
    const { address, city, state, country, lat, lng, name, description, price } = req.body

    const newSpot = await Spot.create({
        ownerId: req.user.id,
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price
    })

    res.status(201)
    return res.json(newSpot)
})


router.post('/:spotId/images', requireAuth, async (req, res, next) => {

    const { url, preview } = req.body;
    const spot = await Spot.findByPk(req.params.spotId)

    if (!spot) {
        res.status(404)
        return res.json({ message: "Spot couldn't be found" })
    }

    if (spot.ownerId !== req.user.id) {
        res.status(403)
        return res.json({ message: "forbidden" });
    }

    let newImage = await SpotImage.create({
        spotId: spot.id,
        url,
        preview,
    });

    const result = {
        id: newImage.id,
        url: newImage.url,
        preview: newImage.preview
    }

    return res.json(result)
});


router.put('/:spotId', requireAuth, validateSpot, handleValidationErrors, async (req, res) => {
    const { address, city, state, country, lat, lng, name, description, price } = req.body
    const spot = await Spot.findByPk(req.params.spotId)

    if (!spot) {
        res.status(404)
        return res.json({ message: "Spot couldn't be found" })
    }

    if (spot.ownerId !== req.user.id) {
        res.status(403)
        return res.json({ message: "forbidden" });
    }

    spot.address = address || spot.address;
    spot.city = city || spot.city;
    spot.state = state || spot.state;
    spot.country = country || spot.country;
    spot.lat = lat || spot.lat;
    spot.lng = lng || spot.lng;
    spot.name = name || spot.name;
    spot.description = description || spot.description;
    spot.price = price || spot.price;

    await spot.save()

    return res.json(spot)
})


router.delete('/:spotId', requireAuth, async (req, res) => {

    const spot = await Spot.findByPk(req.params.spotId)

    if (!spot) {
        res.status(404)
        return json({ message: `Spot couldn't be found` })
    }

    if (spot.ownerId != req.user.id) {
        res.status(403)
        return res.json({ message: "Forbidden" })
    }

    await spot.destroy()

    return res.json({ message: "Successfully deleted" })
})

//Get all Reviews by a Spot's id
router.get('/:spotId/reviews', async (req, res) => {
    const spot = await Spot.findByPk(req.params.spotId)
    if (!spot) {
        res.status(404)
        return res.json({ message: "Spot couldn't be found" })
    }

    const allreviews = await Review.findAll({
        where: { spotId: req.params.spotId },
        include: [
            { model: User },
            { model: ReviewImage, attributes: ["id", "url"] }
        ]
    })

    // if (!allreviews.length) {
    //     res.status(404)
    //     return res.json({ message: "Spot couldn't be found" })
    // }

    return res.json({ Reviews: allreviews })
});


router.post('/:spotId/reviews', requireAuth, validateReview, handleValidationErrors, async (req, res) => {
   
    const { review, stars } = req.body
    const  userId = req.user.id
    const spotId = parseInt(req.params.spotId)
   
    const spot = await Spot.findByPk(spotId)

    if (!spot) {
        res.status(404)
        return res.json({ message: "Spot couldn't be found" })
    }

    const oldReview = await Review.findOne({
        where: {
            spotId: spotId,
            userId: userId
        }
    })
    if(oldReview){
        res.status(500)
        return res.json({ message: "User already has a review for this spot" })
    }

    const newReview = await Review.create({
        userId: userId,
        spotId: spotId,
        review: review,
        stars: stars
    })
    newReview.save()

    res.status(201)
    return res.json(newReview)
})



module.exports = router;

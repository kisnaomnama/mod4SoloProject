// backend/routes/api/users.js
const express = require('express')
const { Op, Sequelize } = require('sequelize')
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Spot, Booking, Review, SpotImage, ReviewImage } = require('../../db/models');
// const { route } = require('./session');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
// 


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
        .withMessage('City is required'),
    check('state')
        .exists({ checkFalsy: true })
        .isLength({ min: 2 })
        .withMessage('State is required'),
    check('country')
        .exists({ checkFalsy: true })
        .isLength({ min: 3 })
        .withMessage('Country is required'),
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

    handleValidationErrors,
];

const validateReview = [
    check('review')
        .exists({ checkFalsy: true })
        .isLength({ min: 1 })
        .withMessage('Review text is required'),
    check('stars')
        .exists({ checkFalsy: true })
        .isInt({ min: 1, max: 5 })
        .withMessage('Stars must be an integer from 1 to 5'),
    handleValidationErrors,
];


const validateBooking = [
    check('startDate')
        .exists({ checkFalsy: true })
        .isAfter(new Date().toISOString()) // Validates that the startDate is in the future
        .withMessage('startDate cannot be in the past'),

    check('endDate')
        .exists({ checkFalsy: true })
        .isAfter(new Date().toISOString()) 
        .withMessage('endDate cannot be on or before startDate')
        .custom((endDate, { req }) => endDate > req.body.startDate) // Validates that endDate is after startDate
        .withMessage('endDate cannot be on or before startDate'),
    handleValidationErrors,
]


const calculateAvgRating = (reviews) => {
    if (reviews.length === 0) return null;
    const sum = reviews.reduce((acc, curr) => acc + curr.stars, 0);
    return sum / reviews.length;
};

const calculateReviewlength = (reviews) => {
    if (reviews.length) return null
    return reviews.length
}

router.get('/', async (req, res) => {

    const spots = await Spot.findAll({
        include: [
            {
                model: Review
            }
        ]
    });

    spots.forEach(spot => {
        spot.avgRating = calculateAvgRating(spot.Reviews);
    });


    for (let i = 0; i < spots.length; i++) {
        const spotImgPreview = await SpotImage.findOne({
            where: {
                spotId: spots[i].id,
                preview: true
            }
        });
        spots[i].previewImage = spotImgPreview ? spotImgPreview.url : null;
    }

    const formattedSpots = spots.map(spot => ({
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
        avgRating: spot.avgRating,
        previewImage: spot.previewImage
    }));

    return res.json({ Spots: formattedSpots });
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

    spots.forEach(spot => {
        spot.avgRating = calculateAvgRating(spot.Reviews);
    });

    for (let i = 0; i < spots.length; i++) {
        const spotImgPreview = await SpotImage.findOne({
            where: {
                spotId: spots[i].id,
                preview: true
            }
        });
        spots[i].previewImage = spotImgPreview ? spotImgPreview.url : null;
    }

    const formattedSpots = spots.map(spot => ({
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
        avgRating: spot.avgRating,
        previewImage: spot.previewImage
    }));

    return res.json({ Spots: formattedSpots });
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

router.post('/', requireAuth, validateSpot, async (req, res) => {
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


router.put('/:spotId', requireAuth, validateSpot, async (req, res) => {
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
        return res.json({ message: `Spot couldn't be found` })
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
            {
                model: User,
                attributes: ['id', 'firstname', 'lastName']
            },
            { model: ReviewImage, attributes: ["id", "url"] }
        ]
    })

    // if (!allreviews.length) {
    //     res.status(404)
    //     return res.json({ message: "Spot couldn't be found" })
    // }

    return res.json({ Reviews: allreviews })
});


router.post('/:spotId/reviews', requireAuth, validateReview, async (req, res) => {

    const { review, stars } = req.body
    const userId = req.user.id
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

    if (oldReview) {
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
});

//Get all Bookings for a Spot based on the Spot's id
router.get('/:spotId/bookings', requireAuth, async (req, res) => {
    const spotId = parseInt(req.params.spotId)

    const spot = await Spot.findByPk(spotId);

    if (!spot) {
        res.status(404)
        return res.json({ message: "Spot couldn't be found" });
    }

    const usersBookings = await Booking.findAll({
        attributes: ['spotId', 'startDate', 'endDate'],
        where: {
            spotId: req.params.spotId,
            userId: req.user.id
        }
    })

    const ownersBooking = await Booking.findAll({
        where: {
            spotId: spot.id
        },
        include: [{
            model: User,
            attributes: ['id', 'firstName', 'lastName']
        }]
    })

    let resultBookings = null;

    if (spot.ownerId === req.user.id) {
        resultBookings = ownersBooking
    }
    if (spot.ownerId !== req.user.id) {
        resultBookings = usersBookings
    }

    return res.json({ Bookings: resultBookings })
});


router.post('/:spotId/bookings', requireAuth, validateBooking, async (req, res, next) => {
    const spotId = parseInt(req.params.spotId)
    const userId = parseInt(req.user.id)

    const { startDate, endDate } = req.body

    const spot = await Spot.findByPk(spotId);

    if (!spot) {
        res.status(404)
        return res.json({ message: "Spot couldn't be found" });
    }

    if (spot.ownerId === userId) {
        res.status(403)
        return res.json({ message: "Forbidden" });
    }

    const bookedSpots = await Booking.findAll({
        where: {
            spotId: spotId,
            [Op.or]: [
                { startDate: { [Op.between]: [startDate, endDate] } },
                { endDate: { [Op.between]: [startDate, endDate] } }
            ]
        }
    })

    if(bookedSpots.length > 0){
        const err = new Error("Existing bookings found")
        res.status(400)
        err.message = "Sorry, this spot is already booked for the specified dates"
        err.errors = {
            "startDate": "Start date conflicts with an existing booking",
            "endDate": "End date conflicts with an existing booking"
        }
        return next(err)
    }

    const newBooking = await Booking.create({
        spotId,
        userId,
        startDate,
        endDate,
    })

    res.json(newBooking)
})






module.exports = router;

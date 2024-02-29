// backend/routes/api/users.js
const express = require('express')
// const { Op } = require('sequelize')
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Spot, Review, SpotImage } = require('../../db/models');
// const { route } = require('./session');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

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
        .isLength({ max: 50 })
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
    const { address, city, state, country, lat, lng, name, description } = req.body

    const newSpot = await Spot.create({
        ownerId: req.user.id,
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description
    })

    res.status(201)
    res.json(newSpot)
})



// router.post("/:spotId/images", requireAuth, async (req, res) => {
//     let { spotId } = req.params;
  
//     let { url, preview } = req.body;
  
//     let spot = await Spot.findByPk(spotId);
  
//     if (!spot) {
//       return res.status(404).json({
//         message: "Spot couldn't found",
//       });
//     }
  
//     if (spot.ownerId !== req.user.id) {
//       return res
//         .status(403)
//         .json({ message: "Unauthorized - Spot does not belong to current user" });
//     }
  
//     let newImage = await SpotImage.create({
//       spotId,
//       url,
//       preview,
//     });
  
//     res.status(200).json({
//       url: newImage.url,
//       preview: newImage.preview,
//     });
//   });




router.post('/:spotId/images',requireAuth, async (req, res) => {

    const { url, preview } = req.body;
    const spot = await Spot.findBypk(req.params.spotId)
  

    // if(!spot || !spot.lenght){
    //     res.status(404)
    //     res.json({"message": "Spot couldn't be found"})
    // }


    // const newImage = await spot.create({
    //     spotId: spot.id,
    //     url,
    //     preview
    // })

    // newImage.save()

    // const result = {
    //     id: newImage.id,
    //     url: newImage.url,
    //     preview:newImage.preview
    // }
    res.json(spot)

})


module.exports = router;

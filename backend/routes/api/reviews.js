const express = require('express')
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Spot, Review, SpotImage, ReviewImage } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

// const { validateReview } = require('./spot')
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


const router = express.Router();


//Get all Reviews of the Current User
router.get('/current', requireAuth, async (req, res) => {
    const allReviews = await Review.findAll({
        where: { userId: req.user.id },
        include: [
            { model: User },
            {
                model: Spot, attributes: ["id", "ownerId", "address", "city",
                    "state", "country", "lat", "lng", "name", "price"]
            },
            { model: ReviewImage, attributes: ["id", "url"] }
        ]
    })

    // Convert allReviews to a plain JavaScript object
    const resultReviews = allReviews.map(review => review.toJSON());

    // Modify plainObject if needed
    resultReviews.forEach(review => {
        if (review.Spot) {
            review.Spot.previewImage = "image url";
        }
    });

    return res.json({ Reviews: resultReviews })
})


router.post('/:reviewId/images', requireAuth, async (req, res) => {
    const reviewId = req.params.reviewId;
    const { url } = req.body;

    const review = await Review.findOne({
        where: { id: reviewId, userId: req.user.id }
    });

    if (!review) {
        res.status(404)
        return res.json({ message: "Review couldn't be found" });
    }

    const imageCount = await ReviewImage.count({ where: { reviewId: reviewId } });
    if (imageCount >= 10) {
        res.status(403)
        return res.json({ message: "Maximum number of images for this review was reached" });
    }

    const newImage = await ReviewImage.create({ reviewId: reviewId, url: url });

    return res.json({
        id: newImage.id,
        url: newImage.url
    })
});


router.put('/:reviewId', requireAuth, validateReview, handleValidationErrors, async (req, res) => {
    const reviewId  = req.params.reviewId
    const { review, stars } = req.body

    const oldReview = await Review.findOne({
        where: { id: reviewId }
    });

    if (!oldReview) {
        res.status(404)
        return res.json({ message: "Review couldn't be found" });
    }

    if (oldReview.userId != req.user.id) {
        res.status(403)
        return res.json({ message: "Forbidden" })
    }
    

    oldReview.review = review;
    oldReview.stars = stars;

    await oldReview.save();

    res.json(oldReview)
})

router.delete('/:reviewId', requireAuth, async (req, res) => {
    const reviewId = req.params.reviewId

    const oldReview = await Review.findOne({
        where: { id: reviewId }
    });

    if (!oldReview) {
        res.status(404)
        return res.json({ message: "Review couldn't be found" });
    }

    if (oldReview.userId != req.user.id) {
        res.status(403)
        return res.json({ message: "Forbidden" })
    }
    
    await oldReview.destroy()

    return res.json({ message: "Successfully deleted"})
})



module.exports = router;

const express = require('express')
const { requireAuth } = require('../../utils/auth');
const { User, Spot, Review, ReviewImage, SpotImage } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

const validateReview = [
    check('stars')
        .exists({ checkFalsy: true })
        .isInt({ min: 1, max: 5 })
        .withMessage('Stars must be an integer from 1 to 5'),
    check('review')
        .exists({ checkFalsy: true })
        .isLength({ min: 1 })
        .withMessage('Review text is required'),

    handleValidationErrors
];

const addSpotImagePreviewToReviews = async (reviews) => {
    for (let i = 0; i < reviews.length; i++) {
        const review = reviews[i];
        const spotImgPreview = await SpotImage.findOne({
            where: {
                spotId: review.Spot.id,
                preview: true
            }
        });

        if (spotImgPreview) {
            review.Spot.dataValues.previewImage = spotImgPreview.url;
        } else {
            review.Spot.dataValues.previewImage = null;
        }
    }
};

//Get all Reviews of the Current User --> URL: /api/reviews/current
router.get('/current', requireAuth, async (req, res) => {
    const allReviews = await Review.findAll({
        where: { userId: req.user.id },
        include: [
            {
                model: User,
                attributes: ['id', 'firstname', 'lastName']
            },
            {
                model: Spot,
                attributes: ["id", "ownerId", "address", 
                "city", "state", "country", "lat", "lng", "name", "price"]
            },
            {
                model: ReviewImage,
                attributes: ["id", "url"]
            }
        ]
    });

    await addSpotImagePreviewToReviews(allReviews);

    return res.json({ Reviews: allReviews });
})


//Add an Image to a Review based on the Review's id --> URL: /api/reviews/:reviewId/images
router.post('/:reviewId/images', requireAuth, async (req, res) => {
    const reviewId = parseInt(req.params.reviewId);
    const { url } = req.body;

    const review = await Review.findByPk(reviewId);

    if (!review) {
        res.status(404)
        return res.json({ message: "Review couldn't be found" });
    }

    if(review.userId !== req.user.id){
        res.status(403)
        return res.json({ message: "Forbidden" });
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


//Edit a Review --> URL: /api/reviews/:reviewId
router.put('/:reviewId', requireAuth, validateReview, async (req, res) => {
    const reviewId = parseInt(req.params.reviewId)
    const { review, stars } = req.body

    const oldReview = await Review.findByPk(reviewId);

    if (!oldReview) {
        res.status(404)
        return res.json({ message: "Review couldn't be found" });
    }

    if (oldReview.userId !== req.user.id) {
        res.status(403)
        return res.json({ message: "Forbidden" })
    }

    oldReview.review = review || oldReview.review;
    oldReview.stars = stars || oldReview.stars;

    await oldReview.save();

    res.json(oldReview)
})


//Delete a Review --> URL: /api/reviews/:reviewId
router.delete('/:reviewId', requireAuth, async (req, res) => {
    const reviewId = parseInt(req.params.reviewId)

    const oldReview = await Review.findByPk(reviewId);

    if (!oldReview) {
        res.status(404)
        return res.json({ message: "Review couldn't be found" });
    }

    if (oldReview.userId != req.user.id) {
        res.status(403)
        return res.json({ message: "Forbidden" })
    }

    await oldReview.destroy()

    return res.json({ message: "Successfully deleted" })
})

module.exports = router;

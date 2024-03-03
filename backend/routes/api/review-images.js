const express = require('express')

const { Review, ReviewImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

const router = express.Router();


// Delete a Review -->/api/review-images/:imageId
router.delete('/:imageId', requireAuth, async (req, res) => {
    const userId  = parseInt(req.user.id)
    const imageId = parseInt(req.params.imageId)

    const foundImage = await ReviewImage.findByPk(imageId)
    if (!foundImage){
        res.status(404)
        return res.json({ message: `Review Image couldn't be found` })
    } 

    const foundReview = await Review.findOne({ 
        where: { id: foundImage.reviewId } 
    })

    if (foundReview.userId !== userId) {
         res.status(403)
        return res.json({ message: "Forbidden" })
    }
    await foundImage.destroy()

    return res.json({ message: "Successfully deleted" })
})

module.exports = router;

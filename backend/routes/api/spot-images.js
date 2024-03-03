const express = require('express')

const { Spot, SpotImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

const router = express.Router();

// Delete a Spot Image -->/api/spot-images/:imageId
router.delete('/:imageId', requireAuth, async (req, res) => {
    const userId = parseInt(req.user.id)
    const imageId = parseInt(req.params.imageId)

    const foundImage = await SpotImage.findByPk(imageId)
    if (!foundImage) {
        res.status(404)
        return res.json({ message: `Spot Image couldn't be found` })
    }

    const foundSpot = await Spot.findOne({
        where: {
            id: foundImage.spotId
        }
    })

    if (foundSpot.ownerId !== userId) {
        res.status(403)
        return res.json({ message: "Forbidden" })
    }

    await foundImage.destroy()

    return res.json({ message: "Successfully deleted" })
})

module.exports = router;

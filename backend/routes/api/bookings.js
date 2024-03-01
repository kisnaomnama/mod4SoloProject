
const express = require('express')
const {  requireAuth } = require('../../utils/auth');
const { User, Booking, Spot, Review, SpotImage, ReviewImage } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Op, Sequelize } = require("sequelize");

const router = express.Router()


router.get('/current', requireAuth, async (req, res) => {
    const allBookings = await Booking.findAll({
        include: {
            model: Spot,
            attributes: {
                exclude: ['description', 'createdAt', 'updatedAt'],
                include: [[Sequelize.literal(`'image url'`), 'previewImage']]
            }
        },
        where: {
            userId: req.user.id
        }
    })

    res.json({Bookings: allBookings })
})



module.exports = router;

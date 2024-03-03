
const express = require('express')
const { requireAuth } = require('../../utils/auth');
const { User, Booking, Spot, Review, SpotImage, ReviewImage } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Op } = require("sequelize");

const router = express.Router()

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

const getSpotImagesForBookings = async (bookings) => {
    for (let i = 0; i < bookings.length; i++) {
        const booking = bookings[i];
        const spotImgPreview = await SpotImage.findOne({
            where: {
                spotId: booking.Spot.id,
                preview: true
            }
        });

        if (spotImgPreview) {
            booking.Spot.dataValues.previewImage = spotImgPreview.url;
        } else {
            booking.Spot.dataValues.previewImage = null;
        }
    }
};

//Get all of the Current User's Bookings --> URL: /api/bookings/current
router.get('/current', requireAuth, async (req, res) => {
    const allBookings = await Booking.findAll({
        include: {
            model: Spot, attributes: {
                exclude: ['description', 'createdAt', 'updatedAt'],
            }
        },
        where: {
            userId: req.user.id
        }
    });

    await getSpotImagesForBookings(allBookings);
    res.json({ Bookings: allBookings });
})


//Edit a Booking --> URL: /api/bookings/:bookingId
router.put('/:bookingId', requireAuth, validateBooking, async (req, res, next) => {
    const bookingId = parseInt(req.params.bookingId)
    const userId = parseInt(req.user.id)

    const { startDate, endDate } = req.body

    const booking = await Booking.findByPk(bookingId);

    if (!booking) {
        res.status(404)
        return res.json({ message: "Booking couldn't be found" });
    }

    if (booking.userId !== userId) {
        res.status(403)
        return res.json({ message: "Forbidden" });
    }

    const bookingEndDate = new Date(booking.endDate).toISOString();
    // const bookingStartDate = new Date(booking.startDate).toISOString();
    const currentDate = new Date().toISOString();

    // console.log('booking.endDate.......', bookingEndDate);
    // console.log('new Date()............', currentDate);

    if (bookingEndDate < currentDate) {
        res.status(403);
        return res.json({ message: "Past bookings can't be modified" });
    }

    const spotId = parseInt(booking.spotId)

    const bookedSpot = await Booking.findOne({
        where: {
            id: { [Op.ne]: bookingId },
            spotId: spotId,
            startDate: { [Op.lte]: new Date(endDate).toDateString() },
            endDate: { [Op.gte]: new Date(startDate).toDateString() }
        }
    })

    if (bookedSpot) {
        const err = new Error("Existing bookings found")
        err.message = "Sorry, this spot is already booked for the specified dates"
        err.errors = {
            "startDate": "Start date conflicts with an existing booking",
            "endDate": "End date conflicts with an existing booking"
        }
        res.status(400)
        return next(err)
    }

    booking.startDate = startDate 
    booking.endDate = endDate 

    await booking.save()

    res.json(booking)
});



//Delete a Booking --> URL: /api/bookings/:bookingId
router.delete('/:bookingId', requireAuth, async (req, res) => {
    const userId = parseInt(req.user.id)
    const bookingId = parseInt(req.params.bookingId)
    const currentDate = new Date().toISOString();

    const foundBooking = await Booking.findByPk(bookingId, {
        include: { model: Spot }
    });

    if (!foundBooking) {
        res.status(404)
        return res.json({ message: "Booking couldn't be found" })
    }

    const spotOwnerId = foundBooking.Spot.ownerId
    const bookingUserId = foundBooking.userId

    if (bookingUserId === userId || spotOwnerId === userId) {
        if (foundBooking.startDate <= currentDate) {
            res.status(403)
            return res.json({ message: "Bookings that have been started can't be deleted" })
        }

        await foundBooking.destroy()
        return res.json({ message: "Successfully deleted" })
    }

    res.status(403)
    return res.json({ message: "Forbidden" })
})

module.exports = router;

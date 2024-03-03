
const express = require('express')
const { requireAuth } = require('../../utils/auth');
const { User, Booking, Spot, Review, SpotImage, ReviewImage } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Op } = require("sequelize");

const router = express.Router()

const validateStartEndDates = [
    check('startDate')
        .exists({ checkFalsy: true })
        .isAfter(new Date().toISOString())
        .withMessage('startDate cannot be in the past'),
    check('endDate')
        .exists({ checkFalsy: true })
        .custom((value, { req }) => {
            return new Date(value) > new Date(req.body.startDate);
        })
        .withMessage('endDate cannot be on or before startDate'),
    handleValidationErrors
];

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
router.put('/:bookingId', requireAuth, validateStartEndDates, requireAuth, async (req, res) => {
    const { startDate, endDate } = req.body;
    const bookingId = parseInt(req.params.bookingId);
    const userId = req.user.id;

    const booking = await Booking.findByPk(bookingId);

    if (!booking) {
        res.status(403)
        return res.json({
            message: "Booking couldn't be found"
        });
    };

    if (booking.userId !== userId) {
        res.status(403)
        return res.json({
            message: "Forbidden"
        });
    };

    const currentDate = new Date();
    const startDateCheck = new Date(startDate);
    const endDateCheck = new Date(endDate);

    if (endDateCheck < currentDate) {
        res.status(403)
        return res.json({
            message: "Past bookings can't be modified"
        });
    };

    const checkBooking = await Booking.findOne({
        where: {
            id: { [Op.ne]: bookingId },
            spotId: booking.spotId,
            [Op.and]: [
                {
                    startDate: {
                        [Op.lte]: endDateCheck
                    }
                },
                {
                    endDate: {
                        [Op.gte]: startDateCheck
                    }
                }
            ]
        }
    });

    if (checkBooking) {
        const bookingStart = new Date(checkBooking.startDate).getTime();
        const bookingEnd = new Date(checkBooking.endDate).getTime();
        const errorResponse = {
            message: "Sorry, this spot is already booked for the specified dates",
            errors: {}
        };

        if (endDateCheck.getTime() === bookingStart) {
            errorResponse.errors.endDate = "End date conflicts with an existing booking";
        }

        if (startDateCheck >= bookingStart) {
            errorResponse.errors.startDate = "Start date conflicts with an existing booking";
        }

        if (endDateCheck <= bookingEnd) {
            errorResponse.errors.endDate = "End date conflicts with an existing booking";
        }

        if (startDateCheck < bookingStart && endDateCheck > bookingEnd) {
            errorResponse.errors = {
                startDate: "Start date conflicts with an existing booking",
                endDate: "End date conflicts with an existing booking"
            };
        }

        res.status(403)
        return res.json(errorResponse);
    }

    booking.startDate = startDate || booking.startDate
    booking.endDate = endDate || booking.endDate

    await booking.save();

    res.json(booking);
});


//Delete a Booking --> URL: /api/bookings/:bookingId
router.delete('/:bookingId', requireAuth, async (req, res) => {
    const userId = parseInt(req.user.id)
    const bookingId = parseInt(req.params.bookingId)
    const currentDate = new Date().toISOString();

    const checkBooking = await Booking.findByPk(bookingId, {
        include: { model: Spot }
    });

    if (!checkBooking) {
        res.status(404)
        return res.json({ message: "Booking couldn't be found" })
    }

    const spotOwnerId = checkBooking.Spot.ownerId
    const bookingUserId = checkBooking.userId

    if (bookingUserId === userId || spotOwnerId === userId) {
        if (checkBooking.startDate <= currentDate) {
            res.status(403)
            return res.json({ message: "Bookings that have been started can't be deleted" })
        }

        await checkBooking.destroy()
        return res.json({ message: "Successfully deleted" })
    }

    res.status(403)
    return res.json({ message: "Forbidden" })
})

module.exports = router;

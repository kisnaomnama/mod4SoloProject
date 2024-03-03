// backend/routes/api/users.js
const express = require('express')
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

const validateSignup = [
  check('email')
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage('Invalid email'),
  check('username')
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage("Username is required"),
  check('username')
    .not()
    .isEmail()
    .withMessage('Username is required not email'),
  check('firstName')
    .exists({ checkFalsy: true })
    .isLength({ min: 2 })
    .withMessage("First Name is required"),
  check('lastName')
    .exists({ checkFalsy: true })
    .isLength({ min: 2 })
    .withMessage("Last Name is required"),
  check('password')
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage('Password must be 6 characters or more.'),
  handleValidationErrors
];


const validateEmail = async (req, res, next) => {
  const { email } = req.body
  const foundOne = await User.findOne({ where: { email: email } })
  if (foundOne) {
    const err = new Error()
    err.message = 'User already exists'
    err.errors = {
      "email": "User with that email already exists"
    }
  
    next(err)
  }
  next()
}

const validateUserName = async (req, res, next) => {
  const { username } = req.body
  const foundOne = await User.findOne({ where: { username: username } })
  if (foundOne) {
    const err = new Error()
    err.message = 'User already exists'
    err.errors = {
      "username": "User with that namename already exists"
    }

    next(err)
  }
  next()
}

//Sign Up a User -->  URL: /api/users
router.post('/', validateSignup, validateEmail, validateUserName, async (req, res, next) => {
  const { firstName, lastName, email, password, username } = req.body;
  const hashedPassword = bcrypt.hashSync(password);

  const user = await User.create({ firstName, lastName, email, username, hashedPassword });

  const safeUser = {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    username: user.username,
  };

  await setTokenCookie(res, safeUser);

  return res.json({
    user: safeUser
  });
}
);

module.exports = router;

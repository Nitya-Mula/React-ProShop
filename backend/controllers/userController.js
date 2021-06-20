import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js'
import crypto from 'crypto'
import nodemailer from 'nodemailer'
import { generateToken } from '../utils/generateToken.js'

// @desc Auth user & get token
// @route POST /api/users/login
// @access Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    })
  } else {
    res.status(401)
    throw new Error('Invalid email or password')
  }
})

// @desc Register a new user
// @route POST /api/users
// @access Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body
  const userExists = await User.findOne({ email })

  if (userExists) {
    res.status(400)
    throw new Error('User already exists')
  }

  const user = await User.create({ name, email, password })

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    })
  } else {
    res.status(400)
    throw new Error('Cannot register this user')
  }
})

// @desc GET user profile
// @route GET /api/users/profile
// @access Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

// @desc Update user profile
// @route PUT /api/users/profile
// @access Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
  if (user) {
    user.name = req.body.name || user.name
    user.email = req.body.email || user.email

    if (req.body.password) {
      user.password = req.body.password
    }

    const updatedUser = await user.save()
    if (updatedUser) {
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        token: generateToken(updatedUser._id),
      })
    } else {
      res.status(400)
      throw new Error('Unable to update user profile')
    }
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

// @desc GET all Users
// @route GET /api/users
// @access Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({})
  res.json(users)
})

// @desc Delete a user
// @route DELETE /api/users/:id
// @access Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
  if (user) {
    await user.remove()
    res.json({ message: 'User removed' })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

// @desc GET user by ID
// @route GET /api/users/:id
// @access Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password')
  if (user) {
    res.json(user)
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

// @desc Update user
// @route PUT /api/users/:id
// @access Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
  if (user) {
    user.name = req.body.name || user.name
    user.email = req.body.email || user.email
    user.isAdmin =
      req.body.isAdmin !== undefined ? req.body.isAdmin : user.isAdmin
    const updatedUser = await user.save()
    if (updatedUser) {
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
      })
    } else {
      res.status(400)
      throw new Error('Unable to update user')
    }
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

// @desc Check for an existing user
// @route GET /api/users/emailcheck
// @access Public
const checkForExistingUser = asyncHandler(async (req, res) => {
  const { email } = req.headers
  const user = await User.findOne({ email: email })
  if (user) {
    res.status(200)
    res.json({ message: 'User exists' })
  } else {
    res.status(404)
    throw new Error('No such user exists')
  }
})

// @desc Send email with password reset link
// @route POST /api/users/forgotpassword
// @access Public
const sendPasswordResetEmail = asyncHandler(async (req, res) => {
  const { email } = req.body
  console.log(email)
  const user = await User.findOne({ email: email })
  if (user) {
    const token = crypto.randomBytes(20).toString('hex')
    user.resetPasswordToken = token
    user.resetPasswordExpires = Date.now() + 3600000
    const updatedUser = await user.save()
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: `${process.env.EMAIL_ADDRESS}`,
        pass: `${process.env.EMAIL_PASSWORD}`,
      },
    })

    const mailOptions = {
      from: `${process.env.EMAIL_ADDRESS}`,
      to: `${updatedUser.email}`,
      subject: '[PRO-E-SHOP] Link to reset password',
      text:
        'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
        'Please click on the following link, or paste this into your browser to complete the process within one of receving it:\n\n' +
        `http://localhost:3000/reset/${token}\n\n` +
        'If you did not request this, please ignore this email and your password will remain unchanged.\n',
    }
    transporter.sendMail(mailOptions, (err, response) => {
      if (err) {
        response.status(400)
        throw new Error('Unable to send reset email')
      } else {
        response.status(200).send('Success')
      }
    })
    res.status(200)
    res.json({ message: 'Recovery email sent' })
  } else {
    res.status(404)
    throw new Error('No such user exists')
  }
})

// @desc Update user's password from forgot password option
// @route PUT /api/users/updatepassword/:token
// @access Public
const updateUserPassword = asyncHandler(async (req, res) => {
  const { password: newPassword } = req.body
  const token = req.params.token
  const user = await User.findOne({ resetPasswordToken: token })
  if (user) {
    user.password = newPassword
    const updatedUser = await user.save()
    res.status(200)
    res.json(updatedUser)
  } else {
    res.status(400)
    throw new Error('Unable to update password')
  }
})

export {
  authUser,
  getUserProfile,
  registerUser,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
  checkForExistingUser,
  sendPasswordResetEmail,
  updateUserPassword,
}

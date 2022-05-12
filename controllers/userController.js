import User from '../models/userModels.js'
import asyncHandler from 'express-async-handler'
import generateToken from '../utills/generateToken.js'
export const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })

  if (user) {
    const passwordMatch = await user.matchPassword(password)
    if (user && passwordMatch) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      })
    } else {
      res.status(400)
    }
  } else {
    res.status(400)
  }
})
export const registerNewUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body

  const userExists = await User.findOne({ email })

  if (userExists) {
    res.status(400).json({ message: 'User already exists' })
  }

  const user = await User.create({
    name,
    email,
    password,
  })

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    })
  } else {
    res.status(400).JSON({ message: 'Invalid user data' })
  }
})
export const createNewUser = asyncHandler(async (req, res) => {
  const { name, father_name, village,email, phone_number, newUser, total_due, previous_due, password } = req.body
  const user = await User.create({
    name, father_name, village,email, phone_number, newUser, total_due, previous_due, password
  })

  if (user) {
    res.status(201).json({
      user,
      token: generateToken(user._id),
    })
  } else {
    res.status(400).JSON({ message: 'Invalid user data' })
  }
})

// Get User Profile
export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    })
  }
})
// Update User Profile
export const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)

  const { name, email, password } = req.body
  if (user) {
    user.name = name
    user.email = email
    if (password) {
      user.password = password
    }
    const upDateUser = await user.save()
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    })
  } else {
    res.json({ message: 'User Not Found' })
  }
})

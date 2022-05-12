import express from 'express'
import {
  authUser,
  getUserProfile,
  registerNewUser,
  updateUserProfile,
  createNewUser
} from '../controllers/userController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.route('/login').post(authUser)
router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile)

router.route('/signup').post(protect, registerNewUser)
router.route('/create-user').post( createNewUser)

export default router

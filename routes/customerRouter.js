import express from 'express'
import {
  createNewCustomer
} from '../controllers/customerController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

// router.route('/login').post(authCustomer)
// router
//   .route('/profile')
//   .get(protect, getCustomerProfile)
//   .put(protect, updateCustomerProfile)

// router.route('/signup').post(protect, registerNewCustomer)
router.route('/create-customer').post(protect, createNewCustomer)

export default router

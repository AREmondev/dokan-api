import express from 'express'
import {
  addOrderItems,
  allOrderItems,
  singleOrderItems,
  userOrderItems,
  updateOrderToPay,
  cancelOrderItems,
} from '../controllers/orderController.js'

import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.route('/').post(protect, addOrderItems)
router.route('/').get(protect, allOrderItems)
router.route('/userorder').get(protect, userOrderItems)
router.route('/:id').get(protect, singleOrderItems)
router.route('/:id').delete(protect, cancelOrderItems)
router.route('/:id/pay').put(protect, updateOrderToPay)

export default router

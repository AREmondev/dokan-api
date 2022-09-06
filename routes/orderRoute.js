import express from 'express'
import {
  addOrderItems,
  allOrderItems,
  singleOrderItems,
  userOrderItems,
  updateOrderToPay,
  cancelOrderItems,
  getAllOrder,
} from '../controllers/orderController.js'

import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.route('/').post(protect, addOrderItems)
router.route('/').get(protect, getAllOrder)
router.route('/userorder').get(protect, userOrderItems)
router.route('/:id').get(protect, singleOrderItems)
router.route('/:id').delete(protect, cancelOrderItems)
router.route('/:id/pay').put(protect, updateOrderToPay)

export default router

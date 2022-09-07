import express from 'express'
import {
  getSingleProduct,
  getAllProducts,
  createProduct
} from '../controllers/productController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.route('/create').post(protect, createProduct)
router.route('/').get(protect ,getAllProducts)
router.route('/:id').get(protect, getSingleProduct)

export default router

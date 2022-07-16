import express from 'express'
import {
  getSingleProduct,
  getAllProducts,
  createProduct
} from '../controllers/productController.js'

const router = express.Router()

router.route('/create').post(createProduct)
router.route('/').get(getAllProducts)
router.route('/:id').get(getSingleProduct)

export default router

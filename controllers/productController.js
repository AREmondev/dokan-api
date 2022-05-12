import Product from '../models/productModels.js'
import asyncHandler from 'express-async-handler'

export const getAllProducts = asyncHandler(async (req, res) => {
  const product = await Product.find({})
  res.send(product)
})

export const getSingleProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
  if (product) {
    res.send(product)
  } else {
    res.status(404)
    throw new Error('Product Not Found')
  }
})

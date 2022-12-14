import mongoose from 'mongoose'
const productSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    countInStock: { type: Number, required: true },
    expireDate: { type: Date, required: true },
  },
  { timestamp: true },
)

const Product = mongoose.model('Product', productSchema)
export default Product

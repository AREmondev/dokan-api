import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
const paymentSchema = mongoose.Schema(
  {
    type: { type: String, required: true },
    payment: { type: Number, required: false, default: 0 },
    orderProduct: { type: Array, required: false, default: [] },
    due: { type: Number, required: false, default: 0 },
    customer: {
        type: mongoose.Types.ObjectId,
        ref: "Customer"
    }
  },
  { timestamp: true },
)



const Payment = mongoose.model('Payment', paymentSchema)
export default Payment

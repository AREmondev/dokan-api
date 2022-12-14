import mongoose from 'mongoose'
const transitionSchema = mongoose.Schema(
  {
    createdAt: {
      type: Date,
      default: new Date()
    },
    type: { type: String, required: true },
    payment: { type: Number, required: false, default: 0 },
    products: { type: Array, required: false, default: [] },
    due: { type: Number, required: false, default: 0 },
    totalDue:  { type: Number, required: false, default: 0 },
    customer: {
        type: mongoose.Types.ObjectId,
        ref: "Customer",
        required: false,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamp: true },
)



const Transition = mongoose.model('Transition', transitionSchema)
export default Transition

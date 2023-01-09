import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
const TransitionSchema = mongoose.Schema(
  {
    type: { type: String, required: true },
    payment: { type: Number, required: true, default: 0 },
    due: { type: Number, required: true, default: 0 },
  },
  { timestamp: true },
)
const customerSchema = mongoose.Schema(
  {
    pageId: {
      type: Number,
      required: false,
    },
    name: {
      type: String,
      required: true,
    },
    father_name: {
      type: String,
      required: false,
    },
    phone_number: {
      type: String,
      required: false,
    },
    village: {
      type: String,
      required: true,
    },
    total_due: {
      type: Number,
      required: true,
      default: 0
    },
    previous_due: {
      type: Number,
      required: false,
      default: 0
    },
    newCustomer: {
      type: Boolean,
      required: false,
      default: false
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User"
    },
    transitions: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Transition"
      }
    ],
    password: {
      type: String,
      required: false,
    },
    isAdmin: {
      type: Boolean,
      required: false,
      default: false,
    },
    
  },
  { timestamp: true },
)


const Customer = mongoose.model('Customer', customerSchema)
export default Customer

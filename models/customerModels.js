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
    },
    newCustomer: {
      type: Boolean,
      required: true,
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
      required: true,
      default: '12345678'
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    
  },
  { timestamp: true },
)

customerSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}
customerSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next()
  }
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

const Customer = mongoose.model('Customer', customerSchema)
export default Customer

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
const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: false,

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
      required: false,
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
    newUser: {
      type: Boolean,
      required: true,
      default: false
    },
    transitions: [TransitionSchema],
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

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next()
  }
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

const User = mongoose.model('User', userSchema)
export default User

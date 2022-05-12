import mongoose from 'mongoose'

const connectDB = () => {
  try {
    mongoose.connect(
      'mongodb+srv://proshop:proshop@proshop.vik1n.mongodb.net/proshop?retryWrites=true&w=majority',
      { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },
      console.log('Connected'),
    )
  } catch {
    console.log('Db Not Connected')
  }
}

export default connectDB

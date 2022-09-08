import mongoose from 'mongoose'

const connectDB = () => {
  try {
    mongoose.connect(
      'mongodb+srv://emon:emon1122@cluster0.luzy6.mongodb.net/?retryWrites=true&w=majority',
      { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },
      console.log('Connected'),
    )
  } catch {
    console.log('Db Not Connected')
  }
}

export default connectDB

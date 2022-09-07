import mongoose from 'mongoose'

const connectDB = () => {
  try {
    mongoose.connect(
      'mongodb+srv://emon:emon1122@cluster0.luzy6.mongodb.net/?retryWrites=true&w=majoritymongodb+srv://emon:emon1122@cluster0.luzy6.mongodb.net/admin?authSource=admin&replicaSet=atlas-xnf59p-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true',
      { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },
      console.log('Connected'),
    )
  } catch {
    console.log('Db Not Connected')
  }
}

export default connectDB

import mongoose from 'mongoose'

const connectDb = (handler: any) => async (req: any, res: any) => {
  if (mongoose.connections[0].readyState) {
    return handler(req, res)
  }

  const MONGODB_URI = process.env.MONGODB_URI

  if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI in the .env file')
  }

  await mongoose.connect(MONGODB_URI)

  return handler(req, res)
}

export default connectDb

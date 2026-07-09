import mongoose from 'mongoose';

const connectDB = async (retries = 5) => {
  for (let i = 0; i < retries; i++) {
    try {
      const conn = await mongoose.connect(process.env.MONGODB_URI);
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      return;
    } catch (error) {
      console.error(`MongoDB connection attempt ${i + 1}/${retries} failed: ${error.message}`);
      if (i < retries - 1) {
        console.log('Retrying in 5 seconds...');
        await new Promise((r) => setTimeout(r, 5000));
      }
    }
  }
  console.error('MongoDB connection failed after all retries. Server running without DB.');
};

export default connectDB;

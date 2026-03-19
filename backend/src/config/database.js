import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ride_zilla';

    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('✓ MongoDB Connected Successfully');
    return mongoose.connection;
  } catch (error) {
    console.error('✗ MongoDB Connection Error:', error.message);

    // If the environment URI failed and it's not the local URI, try local MongoDB as a fallback.
    const localURI = 'mongodb://localhost:27017/ride_zilla';
    if ((process.env.MONGODB_URI || '').includes('mongodb+srv') && process.env.MONGODB_URI !== localURI) {
      try {
        console.log('Attempting fallback to local MongoDB at', localURI);
        await mongoose.connect(localURI, {
          useNewUrlParser: true,
          useUnifiedTopology: true
        });

        console.log('✓ MongoDB Connected to local fallback');
        return mongoose.connection;
      } catch (localErr) {
        console.error('✗ Local MongoDB fallback failed:', localErr.message);
        throw localErr;
      }
    }

    // Propagate the original error so the caller can decide how to proceed.
    throw error;
  }
};

export default connectDB;

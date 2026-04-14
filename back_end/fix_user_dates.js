import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

async function fixUserDates() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/onigiri');
    console.log('Connected to MongoDB');

    // Find all users
    const allUsers = await User.find({});
    console.log('Total users found:', allUsers.length);

    // Check users without createdAt
    const usersWithoutCreatedAt = await User.find({ createdAt: { $exists: false } });
    console.log('Users without createdAt:', usersWithoutCreatedAt.length);

    if (usersWithoutCreatedAt.length > 0) {
      // Update users without createdAt to have current timestamp
      const result = await User.updateMany(
        { createdAt: { $exists: false } },
        { $set: { createdAt: new Date() } }
      );
      console.log('Updated users with createdAt:', result.modifiedCount);
    }

    // Check and display all users with their dates
    const users = await User.find({});
    for (const user of users) {
      console.log(`User: ${user.name}, Email: ${user.email}, CreatedAt: ${user.createdAt}`);
    }

    console.log('User date fix completed successfully');
  } catch (error) {
    console.error('Error fixing user dates:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

fixUserDates();

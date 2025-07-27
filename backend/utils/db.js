const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URL);
        console.log("Database connected successfully");
    } catch (error) {
        console.error("Error while connecting to Database: ", error);
        process.exit(1);
    }
}

module.exports = { connectDB };
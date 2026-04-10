const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const testIndexes = async () => {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected for testing...");

    // 1. Insert sample data
    await User.insertMany([
        { name: "Alice", email: "alice@test.com", age: 22, hobbies: ["reading", "coding"], bio: "Loves backend dev", userId: "u1" },
        { name: "Bob", email: "bob@test.com", age: 25, hobbies: ["gaming", "coding"], bio: "Full stack wizard", userId: "u2" },
        { name: "Charlie", email: "charlie@test.com", age: 22, hobbies: ["sports"], bio: "Just started learning node", userId: "u3" }
    ]);

    console.log("\n--- Analyzing Text Index on Bio ---");
    const textStats = await User.find({ $text: { $search: "backend" } }).explain("executionStats");
    console.log(`Keys Examined: ${textStats.executionStats.totalKeysExamined}`);
    console.log(`Docs Examined: ${textStats.executionStats.totalDocsExamined}`);
    console.log(`Execution Time (ms): ${textStats.executionStats.executionTimeMillis}`);

    console.log("\n--- Analyzing Compound Index (Email & Age) ---");
    const compoundStats = await User.find({ email: "alice@test.com", age: 22 }).explain("executionStats");
    console.log(`Keys Examined: ${compoundStats.executionStats.totalKeysExamined}`);
    console.log(`Docs Examined: ${compoundStats.executionStats.totalDocsExamined}`);
    console.log(`Execution Time (ms): ${compoundStats.executionStats.executionTimeMillis}`);

    // Cleanup and exit
    await User.deleteMany({});
    mongoose.connection.close();
};

testIndexes();
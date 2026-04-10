const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const connectDB = require('./db');
const User = require('./models/User');

const app = express();
app.use(cors());
app.use(express.json());

// Initialize DB
connectDB();

// POST: Create a User
app.post('/api/users', async (req, res) => {
    try {
        // Generate a unique userId automatically
        const userId = crypto.randomUUID(); 
        const user = new User({ ...req.body, userId });
        await user.save();
        res.status(201).json({ message: "User created", user });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// GET: Retrieve, Filter, Search, Sort, and Paginate
app.get('/api/users', async (req, res) => {
    try {
        const { name, email, age, hobby, bioSearch, page = 1, limit = 10, sortBy = 'name' } = req.query;
        let query = {};

        // Querying & Filtering Logic
        if (name) query.name = new RegExp(name, 'i'); // Case-insensitive search
        if (email) query.email = email;
        if (age) query.age = age;
        if (hobby) query.hobbies = { $in: [hobby] };
        
        // Text search on bio
        if (bioSearch) query.$text = { $search: bioSearch };

        // Pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        const users = await User.find(query)
            .sort(sortBy)
            .skip(skip)
            .limit(parseInt(limit));

        res.status(200).json({ count: users.length, users });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT: Update User by ID (_id)
app.put('/api/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!user) return res.status(404).json({ message: "User not found" });
        res.status(200).json({ message: "User updated", user });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// DELETE: Delete User by ID (_id)
app.delete('/api/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});     
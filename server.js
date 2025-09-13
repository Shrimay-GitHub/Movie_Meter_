require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? ['https://your-app-name.vercel.app', 'https://*.vercel.app'] 
        : ['http://localhost:8000', 'http://127.0.0.1:8000', 'http://localhost:8080', 'http://127.0.0.1:8080'],
    credentials: true
}));

// Database connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('MongoDB connection error:', err);
        // Don't exit in serverless environment
        if (process.env.NODE_ENV !== 'production') {
            process.exit(1);
        }
    }
};

// Connect to database
connectDB();

// Models
const User = require('./models/User');
const Movie = require('./models/models/Movie');
const Rating = require('./models/models/models/Rating');

// Authentication middleware
const authenticate = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).send({ error: 'Access denied. No token provided.' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(400).send({ error: 'Invalid token.' });
    }
};

// Routes
// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development'
    });
});

app.post('/api/signup', async (req, res) => {
    try {
        const { username, email, password, dob, phone } = req.body;
        
        // Trim whitespace
        const trimmedUsername = username.trim();
        const trimmedEmail = email.trim();
        
        // Check if user exists (case-insensitive)
        const existingUser = await User.findOne({ 
            $or: [
                { username: { $regex: new RegExp(`^${trimmedUsername}$`, 'i') } },
                { email: { $regex: new RegExp(`^${trimmedEmail}$`, 'i') } }
            ]
        });
        
        if (existingUser) {
            const conflictField = existingUser.username.toLowerCase() === trimmedUsername.toLowerCase() ? 'Username' : 'Email';
            return res.status(400).send({ error: `${conflictField} already exists.` });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = new User({
            username: trimmedUsername,
            email: trimmedEmail,
            password: hashedPassword,
            dob,
            phone
        });

        await user.save();
        console.log(`New user created: ${user.username}`);

        // Generate token
        const token = jwt.sign({ userId: user._id, username: user.username }, process.env.JWT_SECRET, {
            expiresIn: '24h'
        });

        res.send({ token, username: user.username });
    } catch (err) {
        console.error('Signup error:', err);
        res.status(500).send({ error: err.message });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Trim whitespace and make case-insensitive search
        const trimmedUsername = username.trim();
        const user = await User.findOne({ 
            username: { $regex: new RegExp(`^${trimmedUsername}$`, 'i') } 
        });
        
        if (!user) {
            console.log(`Login attempt failed: User '${trimmedUsername}' not found`);
            return res.status(400).send({ error: 'Invalid username or password.' });
        }
        
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            console.log(`Login attempt failed: Invalid password for user '${user.username}'`);
            return res.status(400).send({ error: 'Invalid username or password.' });
        }

        console.log(`User '${user.username}' logged in successfully`);
        
        // Generate token
        const token = jwt.sign({ userId: user._id, username: user.username }, process.env.JWT_SECRET, {
            expiresIn: '24h'
        });

        res.send({ token, username: user.username });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).send({ error: err.message });
    }
});

app.get('/api/movies', authenticate, async (req, res) => {
    try {
        const movies = await Movie.find();
        res.send(movies);
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

app.post('/api/ratings', authenticate, async (req, res) => {
    try {
        const { movieId, rating } = req.body;
        
        // Check if rating exists
        let existingRating = await Rating.findOne({
            user: req.user.userId,
            movie: movieId
        });

        if (existingRating) {
            existingRating.rating = rating;
            await existingRating.save();
        } else {
            existingRating = new Rating({
                user: req.user.userId,
                movie: movieId,
                rating
            });
            await existingRating.save();
        }

        res.send(existingRating);
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

app.get('/api/ratings/:movieId', authenticate, async (req, res) => {
    try {
        const rating = await Rating.findOne({
            user: req.user.userId,
            movie: req.params.movieId
        });
        
        res.send(rating || { rating: 0 });
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

const PORT = process.env.PORT || 3001;

// For Vercel serverless deployment
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

// Export for Vercel
module.exports = app;
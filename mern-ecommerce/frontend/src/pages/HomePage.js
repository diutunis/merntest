const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const drawingRoutes = require('../routes/drawingRoutes');
const productRoutes = require('./routes/productRoutes');
const bodyParser = require('body-parser');
const Drawing = require('./models/Drawing'); // Correcting the path to the model





// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Use middleware

app.use(cors({
    origin: '*', // Allow all origins (you can restrict this to specific origins if needed)
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // Allow cookies or authorization headers, if needed
}));
app.use(express.json());
app.use(bodyParser.json({ limit: '10mb' })); // Set higher limit for large base64 strings

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// GET route to fetch paginated drawings
app.get('/api/drawings', async (req, res) => {
    const { page = 1, limit = 30 } = req.query; // Default page is 1 and limit is 30
    try {
        const drawings = await Drawing.find({})
            .sort({ createdAt: -1 }) // Sort by creation date, newest first
            .limit(parseInt(limit))   // Convert limit to number
            .skip((page - 1) * limit); // Skip previous pages

        const totalDrawings = await Drawing.countDocuments(); // Total number of drawings
        const totalPages = Math.ceil(totalDrawings / limit);   // Total number of pages

        res.json({
            drawings,
            currentPage: parseInt(page),
            totalPages,
            totalDrawings
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch drawings' });
    }
});

// POST route to save a new drawing
app.post('/api/drawings', async (req, res) => {
    const { drawing } = req.body;
    try {
        const newDrawing = new Drawing({ drawing, likes: 0 });  // Initialize likes to 0
        await newDrawing.save();
        res.status(201).json(newDrawing);
    } catch (error) {
        res.status(500).json({ error: 'Failed to save drawing' });
    }
});

// POST route to handle "like" functionality
//app.post('/api/drawings/:id/like', async (req, res) => {
  //
// Sample route
app.get('/', (req, res) => {
    res.send('API is running...');
});

app.use('/api/products', productRoutes);

app.use('/api', drawingRoutes); // Prefix "/api" applied


// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
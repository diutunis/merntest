const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const productRoutes = require('./routes/productRoutes');
const bodyParser = require('body-parser');
const Drawing = require('./models/Drawing'); // Mongoose model for drawings

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Use middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json({ limit: '10mb' })); // Set higher limit for large base64 strings

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// GET route to fetch all drawings
app.get('/api/drawings', async (req, res) => {
    try {
        const drawings = await Drawing.find({});
        res.json(drawings);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch drawings' });
    }
});

// POST route to save a new drawing
app.post('/api/drawings', async (req, res) => {
    const { drawing } = req.body;
    try {
        const newDrawing = new Drawing({ drawing });
        await newDrawing.save();
        res.status(201).json(newDrawing);
    } catch (error) {
        res.status(500).json({ error: 'Failed to save drawing' });
    }
});


// Sample route
app.get('/', (req, res) => {
    res.send('API is running...');
});
app.use('/api/products', productRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const saveDrawing = async () => {
    const drawing = canvasRef.current.toDataURL('image/png');
    
    // Send the drawing data to the backend
    await fetch('/api/drawings', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ drawing }),
    });

    setDrawings([...drawings, drawing]);
    clearCanvas();
};
app.post('/api/drawings', (req, res) => {
    const { drawing } = req.body;

    // Save to the database or filesystem here

    res.status(201).json({ message: 'Drawing saved' });
});

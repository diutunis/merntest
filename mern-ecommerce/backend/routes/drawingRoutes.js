const express = require('express');
const Drawing = require('./models/Drawing'); // Adjust path as necessary
const multer = require('multer');
const router = express.Router();

// Multer configuration to handle audio uploads
const storage = multer.memoryStorage();
const upload = multer({ 
    storage, 
    limits: { fileSize: 5 * 1024 * 1024 } // Limit: 5 MB audio files
});

// Route: Like a drawing
router.post('/drawings/:id/like', async (req, res) => {
    try {
        const drawing = await Drawing.findById(req.params.id);
        if (!drawing) {
            return res.status(404).json({ message: 'Drawing not found' });
        }
        drawing.likes += 1; // Increment likes
        await drawing.save();
        res.json({ likes: drawing.likes });
    } catch (error) {
        console.error('Error liking drawing:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Route: Add an audio comment to a drawing
router.post('/drawings/:id/comments', upload.single('audio'), async (req, res) => {
    try {
        const drawing = await Drawing.findById(req.params.id);
        if (!drawing) {
            return res.status(404).json({ message: 'Drawing not found' });
        }

        // Check if audio file is present
        if (!req.file) {
            return res.status(400).json({ message: 'No audio file provided' });
        }

        // Convert audio to Base64 data URL
        const audioURL = `data:audio/wav;base64,${req.file.buffer.toString('base64')}`;

        // Add new comment to the drawing
        const newComment = { audioURL };
        drawing.comments = drawing.comments || [];
        drawing.comments.push(newComment);

        await drawing.save();
        res.status(201).json({ comments: drawing.comments });
    } catch (error) {
        console.error('Error saving audio comment:', error);
        res.status(500).json({ message: 'Error saving audio comment' });
    }
});

module.exports = router;

const express = require('express');
const Drawing = require('./models/Drawing'); // Adjust path as necessary
const multer = require('multer');
const router = express.Router();

// Multer configuration to handle audio uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Like a drawing
router.post('/drawings/:id/like', async (req, res) => {
    try {
        const drawing = await Drawing.findById(req.params.id);
        if (!drawing) {
            return res.status(404).json({ message: 'Drawing not found' });
        }
        drawing.likes += 1; // Increment likes
        await drawing.save();
        return res.json({ likes: drawing.likes });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
});

// Add an audio comment to a drawing
router.post('/drawings/:id/comments', upload.single('audio'), async (req, res) => {
    try {
        const drawing = await Drawing.findById(req.params.id);
        if (!drawing) {
            return res.status(404).json({ message: 'Drawing not found' });
        }

        const audioURL = `data:audio/wav;base64,${req.file.buffer.toString('base64')}`;

        const newComment = { audioURL };
        drawing.comments = drawing.comments || [];
        drawing.comments.push(newComment);

        await drawing.save();
        return res.json({ comments: drawing.comments });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error saving audio comment' });
    }
});

module.exports = router;

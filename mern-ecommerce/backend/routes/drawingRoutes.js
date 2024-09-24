const express = require('express');
const Drawing = require('./models/Drawing'); // Adjust path as necessary
const router = express.Router();

// Like a drawing
router.post('/drawings/:id/like', async (req, res) => {
    try {
        const drawing = await Drawing.findById(req.params.id);
        if (!drawing) {
            return res.status(404).json({ message: 'Drawing not found' });
        }
        drawing.likes += 1; // Increment likes
        await drawing.save(); // Save the updated drawing
        return res.json({ likes: drawing.likes });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;

// Assuming you have Express set up
const express = require('express');
const router = express.Router();
const Drawing = require('../models/Drawing'); // Adjust the path based on your project structure

// Route to increment the like count
router.post('/:id/like', async (req, res) => {
    try {
        // Find the drawing by ID and increment the like count
        const drawing = await Drawing.findByIdAndUpdate(
            req.params.id,
            { $inc: { likes: 1 } }, // $inc operator increments the likes field by 1
            { new: true } // Return the updated document
        );

        if (!drawing) {
            return res.status(404).json({ message: 'Drawing not found' });
        }

        res.json(drawing);
    } catch (error) {
        console.error('Error updating likes:', error);
        res.status(500).json({ message: 'Error updating likes' });
    }
});

module.exports = router;


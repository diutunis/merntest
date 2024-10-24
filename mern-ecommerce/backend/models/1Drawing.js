const mongoose = require('mongoose');

const drawingSchema = new mongoose.Schema({
    drawing: {
        type: String, // Base64 encoded string
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    likes: {
        type: Number,
        default: 0,  // Initialize likes to 0
    },
    comments: [{ audioURL: String }],
    
});

module.exports = mongoose.model('Drawing', DrawingSchema);

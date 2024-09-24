const mongoose = require('mongoose');

const DrawingSchema = new mongoose.Schema({
    drawing: {
        type: String, // Base64 encoded string
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    address: {
        type: String, // Base64 encoded string
        required: false,
    },
    likes: {
        type: Number, // Number of likes for the drawing
        default: 0,   // Default is 0 likes when a drawing is created
    },
});

module.exports = mongoose.model('Drawing', DrawingSchema);

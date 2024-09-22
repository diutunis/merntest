const mongoose = require('mongoose');
const Product = require('./models/Product');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('MongoDB connected');
    })
    .catch(err => {
        console.log(`Error: ${err.message}`);
    });

// Sample Products (Named After US Cities)
const products = [
    {
        name: 'New York',
        image: 'https://via.placeholder.com/150',
        description: 'The city that never sleeps.',
        price: 100,
        countInStock: 10,
    },
    {
        name: 'Los Angeles',
        image: 'https://via.placeholder.com/150',
        description: 'The city of angels.',
        price: 120,
        countInStock: 8,
    },
    {
        name: 'Chicago',
        image: 'https://via.placeholder.com/150',
        description: 'The windy city.',
        price: 90,
        countInStock: 15,
    },
    {
        name: 'Houston',
        image: 'https://via.placeholder.com/150',
        description: 'Space City.',
        price: 110,
        countInStock: 5,
    },
    {
        name: 'Phoenix',
        image: 'https://via.placeholder.com/150',
        description: 'The valley of the sun.',
        price: 95,
        countInStock: 12,
    },
    {
        name: 'Philadelphia',
        image: 'https://via.placeholder.com/150',
        description: 'The city of brotherly love.',
        price: 105,
        countInStock: 6,
    },
    {
        name: 'San Antonio',
        image: 'https://via.placeholder.com/150',
        description: 'Remember the Alamo!',
        price: 85,
        countInStock: 9,
    },
    {
        name: 'San Diego',
        image: 'https://via.placeholder.com/150',
        description: 'America’s Finest City.',
        price: 130,
        countInStock: 7,
    }
];

// Insert Products into Database
const importData = async () => {
    try {
        // Clear existing products if needed
        await Product.deleteMany();
        
        // Insert the new products
        await Product.insertMany(products);

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error}`);
        process.exit(1);
    }
};

importData();

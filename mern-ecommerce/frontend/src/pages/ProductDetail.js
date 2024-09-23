import React, { useState } from 'react';

const ProductDetail = ({ product, onClose }) => {
    const [message, setMessage] = useState(''); // Capture input from text box
    const [isSubmitting, setIsSubmitting] = useState(false); // Handle form submission state

    const handlePurchase = async () => {
        // Open Cash App link in new tab
        window.open('https://cash.app/$3eke', '_blank');

        // Send purchase details (including message) to the backend
        setIsSubmitting(true);

        const purchaseData = {
            productId: product.id, // Assuming the product has an `id` field
            message, // User entered message (e.g., address)
            productName: product.name,
            productDescription: product.description,
            productImage: product.image
        };

        try {
            const response = await fetch('https://merntest-1.onrender.com/api/drawings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(purchaseData),
            });

            const result = await response.json();
            console.log('Purchase saved:', result);

            // Reset input field after submission
            setMessage('');
            setIsSubmitting(false);

            // Optionally close the modal or show a success message
        } catch (error) {
            console.error('Error saving purchase:', error);
            setIsSubmitting(false);
        }
    };

    return (
        <div className="product-detail-overlay">
            <div className="product-detail">
                <button onClick={onClose}>Close</button>

                <img src={product.image} alt={product.name} />
                <h2>{product.name}</h2>
                <p>{product.description}</p>

                {/* Text box for optional message (e.g., address, requests) */}
                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Enter your address send $2 and i will mail you aprint of your drawing"
                    rows="4"
                    cols="50"
                    disabled={isSubmitting}
                />

                {/* Purchase button */}
                <button onClick={handlePurchase} className="purchase-button" disabled={isSubmitting}>
                    {isSubmitting ? 'Processing...' : 'Purchase'}
                </button>
            </div>
        </div>
    );
};

export default ProductDetail;


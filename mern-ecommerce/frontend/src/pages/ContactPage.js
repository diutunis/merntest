import React, { useState } from 'react';

const ContactPage = () => {
    // State to store form values
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you can handle form submission, e.g., send form data to a server
        console.log('Form submitted:', formData);
        // Reset form after submission
        setFormData({
            name: '',
            email: '',
            message: ''
        });
    };

    return (
        <>
            <h1>|instagram| @ezekielrobinson123 |email| 1twopub@gmail.com ||Georgia||</h1>
            <h4>Don't worry, all of your drawings are going to a safe, secure, and private database :)
feel free to contact for commission, freelance, web dev, and design work, or fun.</h4>

            <form onSubmit={handleSubmit} className="contact-form">
                <div>
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="message">Message:</label>
                    <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                    />
                </div>

                <button type="submit">Submit</button>
            </form>
        </>
    );
};

export default ContactPage;

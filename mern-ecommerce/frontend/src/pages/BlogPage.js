import React from 'react';
import './BlogPage.css';

const BlogPage = () => {
    return (
        <div className="pdf-container">
            <iframe
                src="./pdf-file.pdf"
                title="Blog PDF"
                className="responsive-iframe"
                frameBorder="0"
                allowFullScreen
            />
        </div>
    );
};

export default BlogPage;


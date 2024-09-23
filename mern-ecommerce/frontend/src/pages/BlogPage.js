import React from 'react';
import './BlogPage.css'; // Optional for custom styles

const BlogPage = () => {
    return (
        <div className="pdf-container">
            <iframe
                src="./pdf-file.pdf"
                title="Blog PDF"
                width="100%"
                height="1000px"
                frameBorder="0"
                allowFullScreen
            />
        </div>
    );
};

export default BlogPage;

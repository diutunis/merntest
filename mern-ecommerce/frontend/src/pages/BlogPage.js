import React from 'react';
import './BlogPage.css';

const BlogPage = () => {
    return (
        <div className="pdf-container">
            <embed
                src="./pdf-file.pdf"
                type="application/pdf"
                className="responsive-embed"
            />
        </div>
    );
};

export default BlogPage;


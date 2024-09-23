import React from 'react';
import './BlogPage.css'; // Optional for custom styles

const BlogPage = () => {
    return (
        <div className="pdf-container">
            <object
                data=".\public\pdf-file.pdf"
                type="application/pdf"
                width="100%"
                height="1000px"
            >
                <p>
                    It appears your browser doesn't support embedding PDFs. You can{' '}
                    <a href="/path-to-your-pdf-file.pdf">download the PDF</a> instead.
                </p>
            </object>
        </div>
    );
};

export default BlogPage;

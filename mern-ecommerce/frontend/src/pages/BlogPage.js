import React, { useState } from 'react';
import { Document, Page } from 'react-pdf';

import './BlogPage.css'; // Add some styles for the PDF container

const BlogPage = () => {
    const [numPages, setNumPages] = useState(null);

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
    };

    return (
        <div className="pdf-container">
            <Document
                file="\public\pdf-file.pdf"  // Replace this with the actual path to your PDF
                onLoadSuccess={onDocumentLoadSuccess}
            >
                {Array.from(new Array(numPages), (el, index) => (
                    <Page key={`page_${index + 1}`} pageNumber={index + 1} />
                ))}
            </Document>
        </div>
    );
};

export default BlogPage;

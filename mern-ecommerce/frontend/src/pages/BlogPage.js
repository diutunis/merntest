import React from 'react';
import './BlogPage.css'; // Ensure you have appropriate styles for the PDF container
import bookimage from './book.png'; // Adjust the path as needed

const BlogPage = () => {

    return (
        <>
            <section className="container" id="about">
                <h2>You're so sweet, your cigarette smoke tastes like honey</h2>
                <div className="container">
                    <div className="ticker-container">
                        <div className="ticker-tape">
                            <div className="ticker-item">........</div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="artwork">
                <p>
                    {/* Artwork content */}
                </p>
                {/* Embedded Image */}
                <img src={bookimage} alt="Example Artwork" className="artwork-image" />
            </section>

            <section id="print">
                <h2>Good is he who gives and receives naught.</h2>
            </section>
        </>
    );
};

export default BlogPage;




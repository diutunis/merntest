import React from 'react';
import './BlogPage.css'; // Ensure you have appropriate styles for the PDF container
import bookimage from './book.png'; // Adjust the path as needed
import bookimage2 from './book2.png'; // Adjust the path as needed


const BlogPage = () => {

    return (
        <>
            <section className="container" id="about">
                <h2>Dont Forget to Pinch</h2>
                <div className="container">
                    <div className="ticker-container">
                        <div className="ticker-tape">
                            
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

<section id="artwork">
                <p>
                    {/* Artwork content */}
                </p>
                {/* Embedded Image */}
                <img src={bookimage2} alt="Example Artwork" className="artwork-image" />
            </section>

            <section id="print">
                <h2>Good is he who gives and receives naught.</h2>
            </section>


        </>
    );
};

export default BlogPage;




import React from 'react';
import './BlogPage.css'; // Ensure you have appropriate styles for the PDF container

const BlogPage = () => {

    return (
        <>
            <section className="container" id="about">
                <h1>Something I may consume, the dark.</h1>
                <p>
                    {/* Sample text content */}
                </p>
                <iframe 
                    width="560" 
                    height="315" 
                    src="https://www.youtube.com/embed/videoseries?si=fNBY5aaNz3vDA3d-&amp;list=PLRS8X0g1MLdHkBREFOUjdIiiLr3-8kB-N"
                    title="YouTube video player"
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin" 
                    allowFullScreen
                />
     
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
            </section>

            <section id="print">
                <h2>Good is he who gives and receives naught.</h2>
            </section>

            {/* PDF Container */}
            <div className="pdf-container">
                <iframe
                    src="./pdf-file.pdf"
                    title="Blog PDF"
                    className="responsive-pdf"
                    frameBorder="0"
                    allowFullScreen
                />
            </div>
        </>
    );
};

export default BlogPage;

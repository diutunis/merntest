import React, { useEffect, useRef } from 'react';
import './BlogPage.css'; // Ensure you have appropriate styles for the bubble and PDF container

const BlogPage = () => {
    const bubbleRefs = useRef([]);

    useEffect(() => {
        const bubbles = bubbleRefs.current;
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;

        const directions = bubbles.map(() => ({
            x: Math.random() > 0.5 ? 1 : -1,
            y: Math.random() > 0.5 ? 1 : -1,
            speed: Math.random() * 3 + 1,
        }));

        const moveBubbles = () => {
            bubbles.forEach((bubble, index) => {
                const rect = bubble.getBoundingClientRect();
                let newLeft = rect.left + directions[index].speed * directions[index].x;
                let newTop = rect.top + directions[index].speed * directions[index].y;

                // Reverse direction if hitting the edges
                if (newLeft <= 0 || newLeft + rect.width >= screenWidth) {
                    directions[index].x *= -1;
                }
                if (newTop <= 0 || newTop + rect.height >= screenHeight) {
                    directions[index].y *= -1;
                }

                // Update position
                bubble.style.left = `${newLeft}px`;
                bubble.style.top = `${newTop}px`;
            });

            requestAnimationFrame(moveBubbles);
        };

        moveBubbles();
    }, []);

    const renderBubbles = () => {
        return new Array(10).fill(null).map((_, index) => (
            <div
                key={index}
                ref={(el) => (bubbleRefs.current[index] = el)}
                className="bubble"
                style={{
                    position: 'absolute',
                    left: `${Math.random() * window.innerWidth}px`,
                    top: `${Math.random() * window.innerHeight}px`,
                    width: `${50 + Math.random() * 50}px`,
                    height: `${50 + Math.random() * 50}px`,
                    borderRadius: '50%',
                }}
            />
        ));
    };

    return (
        <>
            <div className="container" id="container">
                {renderBubbles()}
            </div>

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



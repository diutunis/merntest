import React, { useEffect, useRef } from 'react';
import './BlogPage.css'; // Ensure you have bubble styles here

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
                    {/* Your long blog content goes here */}
                </p>
                <iframe
                    width="560"
                    height="315"
                    src="https://www.youtube.com/embed/tOtD5SWJHXY"
                    frameBorder="0"
                    allowFullScreen
                />
                <img src="book2.jpg" alt="Description of the image" />
                <h2>You're so sweet, your cigarette smoke tastes like honey</h2>
                <iframe
                    width="560"
                    height="315"
                    src="https://www.youtube.com/embed/zlhMq5KpjUE"
                    frameBorder="0"
                    allowFullScreen
                />

                <div className="container">
                    <div className="ticker-container">
                        <div className="ticker-tape">
                            <div className="ticker-item">........</div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="artwork">
                <iframe
                    width="560"
                    height="315"
                    src="https://www.youtube.com/embed/raE1NC8o0r8"
                    frameBorder="0"
                    allowFullScreen
                />
                <p>
                    {/* Your artwork content */}
                </p>
            </section>

            <section id="print">
                <h2>Good is he who gives and receives naught.</h2>
                <iframe
                    width="560"
                    height="315"
                    src="https://www.youtube.com/embed/Q1eYRIpT7l0"
                    frameBorder="0"
                    allowFullScreen
                />
            </section>

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
        </>
    );
};

export default BlogPage;


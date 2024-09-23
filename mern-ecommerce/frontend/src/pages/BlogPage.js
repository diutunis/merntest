import React, { useEffect, useRef } from 'react';
import './BlogPage.css'; // Custom styles





const BlogPage = () => {
   const bubbleRefs = useRef([]);

    useEffect(() => {
        const bubbles = bubbleRefs.current;

        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;

        // Generate random initial positions and directions for bubbles
        const bubbleData = bubbles.map((bubble) => {
            return {
                x: Math.random() * (screenWidth - 150), // Subtract bubble width
                y: Math.random() * (screenHeight - 150), // Subtract bubble height
                dx: Math.random() > 0.5 ? 1 : -1, // Random x direction
                dy: Math.random() > 0.5 ? 1 : -1, // Random y direction
                speed: Math.random() * 2 + 1, // Random speed
            };
        });

        const moveBubbles = () => {
            bubbles.forEach((bubble, index) => {
                let data = bubbleData[index];

                // Update the positions based on speed and direction
                data.x += data.dx * data.speed;
                data.y += data.dy * data.speed;

                // Reverse direction if bubble hits the edge of the screen
                if (data.x <= 0 || data.x + 150 >= screenWidth) {
                    data.dx *= -1;
                }
                if (data.y <= 0 || data.y + 150 >= screenHeight) {
                    data.dy *= -1;
                }

                // Apply updated positions to bubble element
                bubble.style.transform = `translate(${data.x}px, ${data.y}px)`;
            });

            requestAnimationFrame(moveBubbles); // Continue animation
        };

        moveBubbles(); // Start animation
    }, []);

    return (
        <>
            <div className="container" id="container"></div>

            <section className="container" id="about">
                <h1>Something I may consume, the dark.</h1>
                <p> {/* Your existing text content */} </p>
                
                {/* Floating images and videos as bubbles */}
                <div className="bubble" ref={el => bubbleRefs.current.push(el)}>
                    <iframe 
                        width="150" 
                        height="150" 
                        src="https://www.youtube.com/embed/tOtD5SWJHXY" 
                        frameBorder="0" 
                        allowFullScreen
                    />
                </div>
                <div className="bubble" ref={el => bubbleRefs.current.push(el)}>
                    <img src="book2.jpg" alt="Description of the image" />
                </div>
            </section>

            <section id="gallery">
                {/* Floating carousel items as bubbles */}
                <div className="bubble" ref={el => bubbleRefs.current.push(el)}>
                    <img src="t1.png" alt="Image 1" />
                </div>
            </section>

            <section id="print">
                <div className="bubble" ref={el => bubbleRefs.current.push(el)}>
                    <iframe 
                        width="150" 
                        height="150" 
                        src="https://www.youtube.com/embed/raE1NC8o0r8" 
                        frameBorder="0" 
                        allowFullScreen
                    />
                </div>
                <div className="bubble" ref={el => bubbleRefs.current.push(el)}>
                    <img src="book1.jpg" alt="Description of the image" />
                </div>
            </section>
        </>
    );
};


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

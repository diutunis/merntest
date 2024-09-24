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
                    Ezekiel Robinson is an Artist, confronted by The dark, finally, something he may consume. And he could hear his own water trickling in the distance. He slipped, And noticed the thin damp film on the rocks had become ice Where the moonlight touched it. Still elated by the harvest, Ezekiel continued to eat the darkness, perhaps with more caution now, Periodically lifting his eyes, but never his head, never his mouth.. Ezekiel Robinson finds more comfort crawling, Changing the orientation of his body around his neck. Gyroscopically stabilizing his own head. To reposition those eyes towards the sound of damp footsteps. From this distance, he could see your silhouette. Slowly, silently, and methodically slicing through his dark sinewy feast. Having the dark lightly fall off of your surface, wrapping your form first, like feathers. It reminded Ezekiel of the crows, and crows remind him of memory, of facial recognition, of the type of animosity that can’t develop from a photo but can be captured on film. A medium that REQUIRES and can only express the passage of time. He contorted his body so that he may watch your approach while he simultaneously attempted to eat eat eat as much of the darkness as he could. Breathing became less of a priority as Ezekiel shoveled and slurped more darkness into his mouth leaving less and less space for air. You arrived at the orafice from which he was feeding quickly but motioned towards him so slowly. You wanted to watch him choking we suppose. And So Ezekiel choked and shoveled more violently. In hindsight it was just your gentle nature. You embraced his twisted body, while his focus was solely dedicated to consumption. Slowly but surely his neck began to unravel itself. Ezekiel’s body untwisted and straightened, his arms stopped their frantic flailing and shoveling, his mouth and neck slowly allowed more air, all while still consuming, slowly waining in manic desire. Until his lips finally began to purse and spit.
                </p>
                <iframe width="560" height="315" src="https://www.youtube.com/embed/videoseries?si=fNBY5aaNz3vDA3d-&amp;list=PLRS8X0g1MLdHkBREFOUjdIiiLr3-8kB-N" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                <img src="book2.jpg" alt="Description of the image" />
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


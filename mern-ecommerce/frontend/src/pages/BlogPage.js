import React, { useEffect, useRef } from 'react';
import './BlogPage.css'; // Custom styles





const BlogPage = () => {
    
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
                const newLeft = rect.left + directions[index].speed * directions[index].x;
                const newTop = rect.top + directions[index].speed * directions[index].y;

                if (newLeft <= 0 || newLeft + rect.width >= screenWidth) {
                    directions[index].x *= -1;
                }
                if (newTop <= 0 || newTop + rect.height >= screenHeight) {
                    directions[index].y *= -1;
                }

                bubble.style.left = `${rect.left + directions[index].speed * directions[index].x}px`;
                bubble.style.top = `${rect.top + directions[index].speed * directions[index].y}px`;
            });

            requestAnimationFrame(moveBubbles);
        };

        moveBubbles();
    }, []);



return (
        <>      
            <div className="container" id="container"></div>

            <section className="container" id="about">
                <h1>Something I may consume, the dark.</h1>
                <p>
                    Ezekiel Robinson is an Artist, confronted by The dark, finally, something he may consume. And he could hear his own water trickling in the distance.
He slipped, 
And noticed the thin damp film on the rocks had become ice Where the moonlight touched it.
Still elated by the harvest,
 Ezekiel continued to eat the darkness, 
perhaps with more caution now, 
Periodically lifting his eyes,
 but never his head, never his mouth.. 
Ezekiel Robinson finds more comfort crawling,
Changing the orientation of his body around his neck. 
Gyroscopically stabilizing his own head. 
To reposition those eyes towards the sound of damp footsteps. 
From this distance, he could see your silhouette. 
Slowly, silently, and methodically slicing through his dark sinewy feast. 
Having the dark lightly fall off of your surface, wrapping your form first, like feathers. 
It reminded Ezekiel of the crows, and crows remind him of memory, of facial recognition, of the type of animosity that can’t develop from a photo but can be captured on film. A medium that REQUIRES and can only express the passage of time. 
He contorted his body so that he may watch your approach while he simultaneously attempted to eat eat eat as much of the darkness as he could. 
Breathing became less of a priority as Ezekiel shoveled and slurped more darkness into his mouth leaving less and less space for air. 
You arrived at the orafice from which he was feeding quickly but motioned towards him so slowly. You wanted to watch him choking we suppose. And So Ezekiel choked and shoveled more violently. 
In hindsight it was just your gentle nature. 
You embraced his twisted body, while his focus was solely dedicated to consumption.
Slowly but surely his neck began to unravel itself. Ezekiel’s body untwisted and straightened, his arms stopped their frantic flailing and shoveling, his mouth and neck slowly allowed more air, all while still consuming, slowly waining in manic desire. Until his lips finally began to purse and spit. 


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

                <div className="container">
                    <div className="ticker-container">
                        <div className="ticker-tape">
                            <div className="ticker-item">
                                ........
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="gallery">
                <div className="artwork">
                    <div id="carouselExampleIndicators" className="carousel slide" data-ride="carousel">
                        <ol className="carousel-indicators">
                            <li data-target="#carouselExampleIndicators" data-slide-to="0" className="active"></li>
                            <li data-target="#carouselExampleIndicators" data-slide-to="1"></li>
                            <li data-target="#carouselExampleIndicators" data-slide-to="2"></li>
                        </ol>
                        <div className="carousel-inner">
                            <div className="carousel-item active">
                                <img src="t1.png" className="d-block w-100" alt="Image 1" />
                            </div>
                            <div className="carousel-item">
                                <img src="t2.JPG" className="d-block w-100" alt="Image 2" />
                            </div>
                            <div className="carousel-item">
                                <img src="t5.jpg" className="d-block w-100" alt="Image 4" />
                            </div>
                            <div className="carousel-item">
                                <img src="t6.jpg" className="d-block w-100" alt="Image 5" />
                            </div>
                            <div className="carousel-item">
                                <img src="t7.jpg" className="d-block w-100" alt="Image 6" />
                            </div>
                            <div className="carousel-item">
                                <img src="t8.jpg" className="d-block w-100" alt="Image 7" />
                            </div>
                        </div>
                        <a 
                            className="carousel-control-prev" 
                            href="#carouselExampleIndicators" 
                            role="button" 
                            data-slide="prev"
                        >
                            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span className="sr-only">Previous</span>
                        </a>
                        <a 
                            className="carousel-control-next" 
                            href="#carouselExampleIndicators" 
                            role="button" 
                            data-slide="next"
                        >
                            <span className="carousel-control-next-icon" aria-hidden="true"></span>
                            <span className="sr-only">Next</span>
                        </a>
                    </div>
                </div>

                <div className="artwork">
                    <p>Curl, breakage, and the ephemerality of growth. 

Tree limbs look so lighthearted, until they fall. 
A tree swaying in the wind has a jovial appeal. 
The wind pushing its trunk backwards, bending. It looks like the trees are laughing at us. 

I’m made of soft flesh but for some reason I cannot bend so far. 
Unless I’m laughing. 

Ho ho ho baby! It’s Christmas time! All the time! On my side. 
Dysfunction is our gift. 
And for those of you that don’t behave:

YOU ARE FURTHER NOTIFIED THAT THE LANDLORD HEREBY ELECTS TO 			DECLARE THAT FORFEITURE OF YOUR LEASE UNDER WHICH YOU HOLD 			POSSESSION OF THE PREMISES IF YOU FAIL TO PERFORM OR 						OTHERWISE COMPLY SUCH NON COMPLIANCE WILL INSTITUTE LEGAL 			PROCEEDING TO RECOVER _________ AND POSSESSION OF SAID 					PREMISES. 

Lucky me, my pockets got the knots. My walls, my floors, my roof, all got the knots. 
Even when you can’t find me, you can see through me, you can always find the effigies I never meant to leave behind. 
Check the drain. 
I’m just a budding off of gods curly little head.
I hit the ground and continued to grow. 
Looping with all the other broken loops. 

Let’s go back and forth honey bun, ok I’ll start-
You laugh too much and that’s the fucking problem
My shit is all over the place and that’s called SINCERITY. 
You still think things happen on accident, these things are Sincerely Broken

Sacrifice is the hallmark of true love. 
Everything I lost on the way here is insignificant, now that I know 
I’m here. 
You’ve been beaten and your assailants left the blood behind for me to find. 
Tell me something I can do to redeem you and don’t use the word “revenge”. 
Let’s focus on you. 
First, let’s clean up this mess. 
Ok now back to you. 
You’re only 7 percent blood anyways. 
It’s mostly just water.
Those stains will come right out. 
Now let’s soak those knots. 
I washed your clothes, and folded them. 
You probably want to bathe alone. 

I would give my life for yours. 
Sincerely,
I would lay and let them kill me instead. 
I will live my life for yours. 
I won’t lay and kill myself. 

“I heard a woman weeping on the train, 
I tried to find her in my train car, 
Only to discover the weeping came from the train itself. 
Something about this particular journey must have 
Brought the machine to tears.”

Let me comb your hair. 
Look at all you had to let go. 
Look back at me but you don’t have to smile. 
I remember when you grabbed my chin and kissed my lips. 
I drew it on a sheet of paper. Now my memory has mass and weight. Height and width. Value and white space.
Now my memory can burn and be used as the kindling to 
Keep us warm. My memory can fold now. 
My memory can sop up a watery mess. 
My memory can be hung. 
Framed. Put up on display and sold. 
And ultimately I have to thank the trees that were surveilled their entire lives, until they were eventually mowed down for the sake of industry. 
And that newly barren, sap soaked land
Is the cost of not letting go
</p>
                </div>
            </section>

            <section id="print">
                <img src="book1.jpg" alt="Description of the image" />
                <h2>Good is he who gives and receives naught.</h2>

                <iframe 
                    width="560" 
                    height="315" 
                    src="https://www.youtube.com/embed/raE1NC8o0r8" 
                    frameBorder="0" 
                    allowFullScreen
                />
                <iframe 
                    width="560" 
                    height="315" 
                    src="https://www.youtube.com/embed/Q1eYRIpT7l0" 
                    frameBorder="0" 
                    allowFullScreen
                />
                <iframe 
                    width="560" 
                    height="315" 
                    src="https://www.youtube.com/embed/zlhMq5KpjUE" 
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

import React from 'react';
import './BlogPage.css'; // Custom styles

const BlogPage = () => {
    return (
        <>      
            <div className="container" id="container"></div>

            <section className="container" id="about">
                <h1>Something I may consume, the dark.</h1>
                <p>
                    Ezekiel Robinson is an Artist, confronted by The dark, finally, something he may consume...
                    (Rest of your text)
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
                                Ezekiel Robinson is an Artist...
                                (Rest of your ticker text)
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
                    <p>Curl, breakage, and the ephemerality of growth...</p>
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

import React, { useRef, useState, useEffect } from 'react'; 
import './HomePage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHandSparkles } from '@fortawesome/free-solid-svg-icons';
import { faSprayCan }  from '@fortawesome/free-solid-svg-icons';
import {faTrashCan}  from '@fortawesome/free-solid-svg-icons';

const HomePage = () => {
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [drawings, setDrawings] = useState([]);

    useEffect(() => {
        // Fetch existing drawings from the backend when the component loads
        const fetchDrawings = async () => {
            const response = await fetch('https://merntest-1.onrender.com/api/drawings');
            const data = await response.json();
            setDrawings(data.reverse()); // Reverse the data so newest are at the top
        };
        fetchDrawings();

        // Disable scroll on the entire body when touch events are happening on the canvas
        const disableScroll = (e) => {
            if (e.target === canvasRef.current) {
                e.preventDefault();
            }
        };

        document.body.addEventListener('touchmove', disableScroll, { passive: false });
        return () => {
            document.body.removeEventListener('touchmove', disableScroll);
        };
    }, []);

    // Function to get touch or mouse position relative to canvas
    const getPosition = (nativeEvent) => {
        const rect = canvasRef.current.getBoundingClientRect();
        if (nativeEvent.touches) {
            const touch = nativeEvent.touches[0];
            return { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
        }
        return { x: nativeEvent.offsetX, y: nativeEvent.offsetY };
    };

    const startDrawing = (nativeEvent) => {
        nativeEvent.preventDefault();  // Prevent scrolling
        const { x, y } = getPosition(nativeEvent);
        const context = canvasRef.current.getContext('2d');
        context.beginPath();
        context.moveTo(x, y);
        setIsDrawing(true);
    };

    const draw = (nativeEvent) => {
        nativeEvent.preventDefault();  // Prevent scrolling
        if (!isDrawing) return;
        const { x, y } = getPosition(nativeEvent);
        const context = canvasRef.current.getContext('2d');
        context.lineTo(x, y);
        context.stroke();
    };

    const stopDrawing = (nativeEvent) => {
        nativeEvent.preventDefault();  // Prevent scrolling
        if (!isDrawing) return;
        const context = canvasRef.current.getContext('2d');
        context.closePath();
        setIsDrawing(false);
    };

    const clearCanvas = () => {
        const context = canvasRef.current.getContext('2d');
        context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    };

    const saveDrawing = async () => {
        const drawing = canvasRef.current.toDataURL('image/png');
        
        // Send the drawing to the backend
        const response = await fetch('https://merntest-1.onrender.com/api/drawings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ drawing }),  // Remove likes from here; the backend should set it to 0
        });
        
        const savedDrawing = await response.json();
        setDrawings((prevDrawings) => [savedDrawing, ...prevDrawings]);  // Add new drawing at the top
        clearCanvas();
    };

    // Function to handle "like" action
    const handleLike = async (drawingId) => {
        // Update the like count in the backend
        const response = await fetch(`https://merntest-1.onrender.com/api/drawings/${drawingId}/like`, {
            method: 'POST',
        });
        const updatedDrawing = await response.json();

        // Update the state with the new number of likes
        setDrawings((prevDrawings) =>
            prevDrawings.map((drawing) =>
                drawing._id === drawingId ? { ...drawing, likes: updatedDrawing.likes } : drawing
            )
        );
    };

    return (
        <div className="drawing-container">
            <canvas
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className="drawing-canvas"
                width={window.innerWidth < 500 ? window.innerWidth * 0.9 : 500}
                height={window.innerWidth < 500 ? window.innerWidth * 0.9 : 500}
            />
            <button onClick={saveDrawing}>|||<FontAwesomeIcon icon={faSprayCan}/>|||</button>
            <button onClick={clearCanvas}>|||<FontAwesomeIcon icon={faTrashCan} />|||</button>

            <div className="posted-drawings">
                {drawings.map((drawing, index) => (
                    <div key={drawing._id} className="drawing-item"> {/* Use drawing._id as key */}
                        <img src={drawing.drawing} alt={`User drawing ${index + 1}`} />
                        <div className="like-section">
                            <button onClick={() => handleLike(drawing._id)}><FontAwesomeIcon icon={faHandSparkles} /></button>
                            <span>{drawing.likes || 0} </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HomePage;

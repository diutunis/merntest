import React, { useRef, useState, useEffect } from 'react';
import './HomePage.css';

const HomePage = () => {
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [drawings, setDrawings] = useState([]);

    useEffect(() => {
        // Fetch existing drawings from the backend when the component loads
        const fetchDrawings = async () => {
            const response = await fetch('https://merntest-1.onrender.com/api/drawings');
            const data = await response.json();
            setDrawings(data);
        };
        fetchDrawings();
    }, []);

    const startDrawing = ({ nativeEvent }) => {
        const { offsetX, offsetY } = nativeEvent;
        const context = canvasRef.current.getContext('2d');
        context.beginPath();
        context.moveTo(offsetX, offsetY);
        setIsDrawing(true);
    };

    const draw = ({ nativeEvent }) => {
        if (!isDrawing) return;
        const { offsetX, offsetY } = nativeEvent;
        const context = canvasRef.current.getContext('2d');
        context.lineTo(offsetX, offsetY);
        context.stroke();
    };

    const stopDrawing = () => {
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
            body: JSON.stringify({ drawing }),
        });
        
        const savedDrawing = await response.json();
        setDrawings([...drawings, savedDrawing]);
        clearCanvas();
    };

    return (
        <div className="drawing-container">
            <canvas
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                className="drawing-canvas"
                width="500"
                height="500"
            />
            <button onClick={saveDrawing}>Post Drawing</button>
            <button onClick={clearCanvas}>Clear Drawing</button>

            <div className="posted-drawings">
                {drawings.map((drawing, index) => (
                    <div key={index} className="drawing-item">
                        <img src={drawing.drawing} alt={`User drawing ${index + 1}`} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HomePage;


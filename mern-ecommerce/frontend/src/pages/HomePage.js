const HomePage = () => {
    const canvasRef = useRef(null);
    const offscreenCanvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [drawings, setDrawings] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const pageSize = 30;

    const [zoom, setZoom] = useState(1);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [context, setContext] = useState(null);
    const [offscreenContext, setOffscreenContext] = useState(null);

    const [textMode, setTextMode] = useState(false); // Toggle for text mode
    const [textPosition, setTextPosition] = useState(null); // Position for text input

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        setContext(ctx);

        const offscreenCanvas = document.createElement('canvas');
        offscreenCanvas.width = canvas.width;
        offscreenCanvas.height = canvas.height;
        const offscreenCtx = offscreenCanvas.getContext('2d');
        offscreenCanvasRef.current = offscreenCanvas;
        setOffscreenContext(offscreenCtx);
    }, []);

    const toggleTextMode = () => {
        setTextMode((prevMode) => !prevMode);
    };

    const handleCanvasClick = (nativeEvent) => {
        if (!textMode) return;

        const { x, y } = getPosition(nativeEvent);
        setTextPosition({ x, y });

        // Prompt for text input
        const userText = prompt('Enter your text:');
        if (userText) {
            drawText(userText, x, y);
        }
    };

    const drawText = (text, x, y) => {
        context.font = '16px Arial'; // You can customize the font and size
        context.fillStyle = 'black'; // Set text color
        context.fillText(text, x, y);

        offscreenContext.font = '16px Arial';
        offscreenContext.fillStyle = 'black';
        offscreenContext.fillText(text, x, y);
    };

    const getPosition = (nativeEvent) => {
        const rect = canvasRef.current.getBoundingClientRect();
        const x = (nativeEvent.clientX - rect.left - pan.x) / zoom;
        const y = (nativeEvent.clientY - rect.top - pan.y) / zoom;
        return { x, y };
    };

    return (
        <div className="drawing-container">
            <canvas
                ref={canvasRef}
                onPointerDown={textMode ? handleCanvasClick : startDrawing}
                onPointerMove={draw}
                onPointerUp={stopDrawing}
                onPointerLeave={stopDrawing}
                className="drawing-canvas"
                width={500}
                height={500}
            />
            <div className="controls">
                <button onClick={toggleTextMode}>
                    {textMode ? 'Exit Text Mode' : 'Text Mode'}
                </button>
                <label htmlFor="zoom">Zoom: {zoom}</label>
                <input
                    type="range"
                    id="zoom"
                    min="0.5"
                    max="3"
                    step="0.1"
                    value={zoom}
                    onChange={handleZoomChange}
                    className="zoom-slider"
                />
            </div>

            <button onClick={saveDrawing}>Post</button>
            <button onClick={clearCanvas}>Clear</button>
            {loading && <h4>Loading...</h4>}
        </div>
    );
};

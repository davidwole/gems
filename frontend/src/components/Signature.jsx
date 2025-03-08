import React, { useRef, useState, useEffect } from "react";

const Signature = ({
  width = 400,
  height = 150,
  lineWidth = 2,
  lineColor = "#000000",
  onSave = (dataUrl) => {},
  className = "",
  name,
}) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);
  const [drawingData, setDrawingData] = useState([]);
  const [savedSignature, setSavedSignature] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (canvasRef.current) {
      drawSignatureLine();
    }
  }, [lineColor, lineWidth, drawingData]);

  const drawSignatureLine = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");

    // Clear canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Draw signature line
    context.beginPath();
    context.moveTo(0, canvas.height - 2);
    context.lineTo(canvas.width, canvas.height - 2);
    context.strokeStyle = "#999999";
    context.lineWidth = 1;
    context.stroke();

    // Set drawing line style
    context.lineWidth = lineWidth;
    context.lineCap = "round";
    context.lineJoin = "round";
    context.strokeStyle = lineColor;

    // Redraw any existing signature
    if (drawingData.length > 0) {
      redrawSignature();
    }
  };

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    // Get mouse position relative to canvas
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Start new path and record point
    context.beginPath();
    context.moveTo(x, y);

    // Initialize this stroke in drawing data
    setDrawingData((prev) => [...prev, { type: "start", x, y }]);

    setIsDrawing(true);
    setIsEmpty(false);
  };

  const draw = (e) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    // Get mouse position relative to canvas
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Draw line to point and record it
    context.lineTo(x, y);
    context.stroke();

    // Add to drawing data
    setDrawingData((prev) => [...prev, { type: "move", x, y }]);
  };

  const endDrawing = () => {
    if (isDrawing) {
      setDrawingData((prev) => [...prev, { type: "end" }]);
    }
    setIsDrawing(false);
  };

  const redrawSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");

    // Set line style for redrawing
    context.lineWidth = lineWidth;
    context.lineCap = "round";
    context.lineJoin = "round";
    context.strokeStyle = lineColor;

    // Redraw from saved path data
    for (let i = 0; i < drawingData.length; i++) {
      const point = drawingData[i];

      if (point.type === "start") {
        context.beginPath();
        context.moveTo(point.x, point.y);
      } else if (point.type === "move") {
        context.lineTo(point.x, point.y);
        context.stroke();
      }
      // 'end' points just finish the current path
    }
  };

  const clear = () => {
    // Clear the drawing data state
    setDrawingData([]);
    setIsEmpty(true);
    setSavedSignature(null);
    setShowPreview(false);

    // Immediately clear the canvas without waiting for state updates
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext("2d");
      context.clearRect(0, 0, canvas.width, canvas.height);

      // Redraw just the signature line
      context.beginPath();
      context.moveTo(0, canvas.height - 2);
      context.lineTo(canvas.width, canvas.height - 2);
      context.strokeStyle = "#999999";
      context.lineWidth = 1;
      context.stroke();
    }
  };

  const save = () => {
    if (isEmpty) return null;

    // Create a temporary canvas just for the signature without the line
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = width;
    tempCanvas.height = height;
    const tempContext = tempCanvas.getContext("2d");

    // Set drawing style
    tempContext.lineWidth = lineWidth;
    tempContext.lineCap = "round";
    tempContext.lineJoin = "round";
    tempContext.strokeStyle = lineColor;

    // Draw only the signature on the temp canvas
    for (let i = 0; i < drawingData.length; i++) {
      const point = drawingData[i];

      if (point.type === "start") {
        tempContext.beginPath();
        tempContext.moveTo(point.x, point.y);
      } else if (point.type === "move") {
        tempContext.lineTo(point.x, point.y);
        tempContext.stroke();
      }
    }

    // Get data URL from the temp canvas (signature only, no line)
    const dataUrl = tempCanvas.toDataURL("image/png");

    // Save the signature and show preview
    setSavedSignature(dataUrl);
    setShowPreview(true);

    // Call the onSave callback
    onSave(dataUrl, name);

    return dataUrl;
  };

  const editSignature = () => {
    setShowPreview(false);
  };

  // Handle touch events for mobile devices
  const handleTouchStart = (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent("mousedown", {
      clientX: touch.clientX,
      clientY: touch.clientY,
    });
    startDrawing(mouseEvent);
  };

  const handleTouchMove = (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent("mousemove", {
      clientX: touch.clientX,
      clientY: touch.clientY,
    });
    draw(mouseEvent);
  };

  const handleTouchEnd = (e) => {
    e.preventDefault();
    endDrawing();
  };

  return (
    <div className={`flex flex-col ${className}`}>
      {showPreview ? (
        <>
          <div
            className="border border-gray-200 flex items-center justify-center"
            style={{ width, height }}
          >
            <img
              src={savedSignature}
              alt="Signature"
              style={{ maxWidth: "100%", maxHeight: "100%" }}
            />
          </div>
        </>
      ) : (
        <>
          <canvas
            ref={canvasRef}
            width={width}
            height={height}
            className="cursor-crosshair touch-none border border-gray-200"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={endDrawing}
            onMouseLeave={endDrawing}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          />
          <div className="sign flex mt-2 space-x-4">
            <button
              type="button"
              onClick={clear}
              className="px-3 py-1 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-100"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={save}
              disabled={isEmpty}
              className={`px-3 py-1 text-sm border rounded ${
                isEmpty
                  ? "text-gray-400 border-gray-200"
                  : "text-blue-600 border-blue-300 hover:bg-blue-50"
              }`}
            >
              Save
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Signature;

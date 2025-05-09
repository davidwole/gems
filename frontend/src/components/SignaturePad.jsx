import { useRef, useState, useEffect } from "react";

export default function SignaturePad({
  label = "Signature",
  onSignatureChange,
}) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [signature, setSignature] = useState(null);

  // Update parent component whenever signature changes
  useEffect(() => {
    if (onSignatureChange) {
      onSignatureChange(signature);
    }
  }, [signature, onSignatureChange]);

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(getX(e), getY(e));
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "black";
    ctx.lineTo(getX(e), getY(e));
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      const canvas = canvasRef.current;
      const newSignature = canvas.toDataURL();
      setSignature(newSignature);
      setIsDrawing(false);
    }
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setSignature(null);
  };

  const getX = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return e.type.includes("touch")
      ? e.touches[0].clientX - rect.left
      : e.clientX - rect.left;
  };

  const getY = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return e.type.includes("touch")
      ? e.touches[0].clientY - rect.top
      : e.clientY - rect.top;
  };

  return (
    <>
      <style>
        {`
          .signature-container {
            display: flex;
            flex-direction: column;
          }
          .canvas-wrapper {
            position: relative;
            width: 366px;
          }
          .signature-canvas {
            border: none;
            border-bottom: 1px solid black;
            width: 366px;
            height: 50px;
          }
          .placeholder {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #9ca3af;
            pointer-events: none;
          }
          .clear-button {
            position: absolute;
            top: 4px;
            right: 4px;
            font-size: 0.75rem;
            color: #6b7280;
            background: none;
            border: none;
            cursor: pointer;
          }
          .clear-button:hover {
            color: #374151;
          }
          .signature-label {
            margin-top: 10px;
            font-size: 0.875rem;
            color: #4b5563;
          }
        `}
      </style>
      <div className="signature-container">
        <div className="canvas-wrapper">
          <canvas
            ref={canvasRef}
            width={366}
            height={50}
            className="signature-canvas"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
          />
          {!signature && <div className="placeholder">Sign here</div>}
          <button onClick={clearSignature} className="clear-button">
            Clear
          </button>
        </div>
        <label>{label}</label>
      </div>
    </>
  );
}

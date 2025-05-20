import { useRef, useState, useEffect } from "react";

export default function SignaturePadView({ label = "Signature", signature }) {
  const canvasRef = useRef(null);

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
            border: none;
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
          {signature ? (
            <img
              width={366}
              height={50}
              className="signature-canvas"
              src={signature}
            />
          ) : (
            <div
              style={{
                width: "366px",
                height: "50px",
                border: "none",
                borderBottom: "1px solid black",
              }}
            ></div>
          )}
        </div>
        <label>{label}</label>
      </div>
    </>
  );
}

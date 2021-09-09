import React, { useEffect, useState, useRef } from "react";
import "./app.css";
import ResetButton from "./resetButton.jsx";
import OutputBox from "./outputBox.jsx";
import { Tensor, InferenceSession } from "onnxjs";

//const MODEL_URL = "./models/mnist_model_conv.onnx";
const MODEL_URL = "./models/doodle_model_onnx.onnx";
let sess;

const loadModel = async () => {
  sess = new InferenceSession();
  await sess.loadModel(MODEL_URL);
};
loadModel();

function Box() {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [output, setOutput] = useState(new Float32Array(10).fill(0));
  const [isDrawing, setIsDrawing] = useState(false);
  const [showHint, setShowHint] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = 280;
    canvas.height = 280;

    canvas.style.width = `560px`;
    canvas.style.height = `560px`;

    const context = canvas.getContext("2d");
    context.scale(0.5, 0.5);
    context.lineCap = "round";
    context.strokeStyle = "white";
    context.lineWidth = 20;
    
    context.font = "50px Arial";
    context.fillStyle = "white";
    context.textAlign = "center";
    context.fillText("Draw here!", 560/2, 560/2);

    contextRef.current = context;
  }, []);


  function drawHint() {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.font = "50px Arial";
    context.fillStyle = "white";
    context.textAlign = "center";
    context.fillText("Draw here!", 560/2, 560/2);
  }

  async function runModel(imageData, sess) {
    const input = new Tensor(imageData, "float32", [280, 280, 4]);
    const outputMap = await sess.run([input]);
    const outputTensor = outputMap.values().next().value;
    setOutput(outputTensor.data);
    return outputTensor.data;
  }

  const startDrawingMouse = ({ nativeEvent }) => {
    const { layerX, layerY } = nativeEvent;
    startDrawing(layerX, layerY);
    
  };

  const startDrawingTouch = (event) => {
    const { clientX, clientY } = event.touches[0];
    startDrawing(clientX, clientY);
  };

  const startDrawing = (x, y) => {
    contextRef.current.beginPath();
    contextRef.current.moveTo(x, y);
    
    setIsDrawing(true);
    
  };

  const drawMouse = ({ nativeEvent }) => {
    if (!isDrawing) {
      return;
    }
    const { layerX, layerY } = nativeEvent;
    draw(layerX, layerY);
  };

  const drawTouch = (event) => {
    if (!isDrawing) {
      return;
    }
    const { clientX, clientY } = event.touches[0];
    draw(clientX, clientY);
  };

  const draw = (x, y) => {
    if (showHint) {
      clearBoard()
      setShowHint(false);
    }
    contextRef.current.lineTo(x, y);
    contextRef.current.stroke();
    let imageData = contextRef.current.getImageData(0, 0, 280, 280);
    runModel(Float32Array.from(imageData.data), sess);
  };

  const finishDrawing = () => {
    contextRef.current.closePath();
    setIsDrawing(false);
  };

  function clearBoard() {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, 560, 560);
    contextRef.current = context;
  }

  function handleReset() {
    clearBoard();
    setOutput(new Float32Array(10).fill(0));
    drawHint();
    setShowHint(true);
    
  }

  return (
    <React.Fragment>
      <main className="container appWrapper">
        <div className="row flex appBox shadow">
          <div className="col drawingBox">
            <div className="drawingBoxDiv">
              <canvas
                onTouchStart={startDrawingTouch}
                onTouchEnd={finishDrawing}
                onTouchMove={drawTouch}
                onMouseDown={startDrawingMouse}
                onMouseUp={finishDrawing}
                onMouseMove={drawMouse}
                ref={canvasRef}
              >
                <p>Draw here!</p>
              </canvas>
            </div>
          </div>
          <div className="col-4 outputBox">
            <div className="outputWrapper">
              <OutputBox output={output} />
              <ResetButton onReset={handleReset} />
            </div>
          </div>
        </div>
      </main>
    </React.Fragment>
  );
}

export default Box;

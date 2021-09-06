import React, { useEffect, useState, useRef } from "react";
import "./app.css";
import ResetButton from "./resetButton.jsx";
import OutputBox from "./outputBox.jsx";
import { Tensor, InferenceSession } from "onnxjs";

const MODEL_URL = "./models/mnist_onnx_model.onnx";
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

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = 280;
    canvas.height = 280;

    canvas.style.width = `560px`;
    canvas.style.height = `560px`;

    const context = canvas.getContext("2d");
    context.scale(0.5, 0.5);
    context.lineCap = "square";
    context.strokeStyle = "white";
    context.lineWidth = 20;
    contextRef.current = context;
  }, []);

  async function runModel(imageData, sess) {
    const input = new Tensor(imageData, "float32", [280, 280, 4]);
    const outputMap = await sess.run([input]);
    const outputTensor = outputMap.values().next().value;
    setOutput(outputTensor.data);
    return outputTensor.data;
  }

  const startDrawing = ({ nativeEvent }) => {
    const { layerX, layerY } = nativeEvent;
    contextRef.current.beginPath();
    contextRef.current.moveTo(layerX, layerY);
    setIsDrawing(true);
  };

  const finishDrawing = () => {
    contextRef.current.closePath();
    setIsDrawing(false);
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing) {
      return;
    }
    const { layerX, layerY } = nativeEvent;
    contextRef.current.lineTo(layerX, layerY);
    contextRef.current.stroke();
    let imageData = contextRef.current.getImageData(0, 0, 280, 280);
    runModel(Float32Array.from(imageData.data), sess);
  };

  function handleReset() {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, 560, 560);
    contextRef.current = context;
    setOutput(new Float32Array(10).fill(0));
  }

  return (
    <React.Fragment>
      <main className="container">
        <div className="row flex appBox shadow">
          <div className="col drawingBox">
            <div className="drawingBoxDiv">
              <canvas
                onMouseDown={startDrawing}
                onMouseUp={finishDrawing}
                onMouseMove={draw}
                ref={canvasRef}
              ></canvas>
            </div>
          </div>
          <div className="col-4 outputBox">
            <OutputBox output={output} />
            <ResetButton onReset={handleReset} />
          </div>
        </div>
      </main>
    </React.Fragment>
  );
}

export default Box;

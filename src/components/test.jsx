//import { Tensor, InferenceSession } from "onnxjs";
onnx = require("onnxjs");

async function test() {
  const sess = new onnx.InferenceSession();

  let input = new Float32Array(280 * 280 * 4).fill(0);
  input = new onnx.Tensor(input, "float32", [280, 280, 4]);
  await sess.loadModel("./doodle_model_onnx.onnx");
  const outputMap = await sess.run([input]);
  const outputTensor = outputMap.values().next().value;
  console.log(outputTensor.data);
}
test();

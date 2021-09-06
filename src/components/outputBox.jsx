import React from "react";
import "./outputBox.css";

function OutputBox(props) {
  function generateResults() {
    let results = [];
    let maxIndex = findMaxIndex(props.output);
    let isMax;
    for (let i = 0; i < props.output.length; i++) {
      if (i === maxIndex) isMax = true;
      results.push(createBar(props.output[i], isMax, i));
      isMax = false;
    }

    return results;
  }

  function findMaxIndex(array) {
    let max = 0;
    let maxIdx;
    for (let i = 0; i < array.length; i++) {
      if (array[i] > max) {
        max = array[i];
        maxIdx = i;
      }
    }
    return maxIdx;
  }

  function createBar(score, isMax, idx) {
    let barClass = "outputBar";
    if (isMax) {
      barClass += " max";
    }
    let bar = (
      <div key={idx} className="outputRow">
        <div className="num">
          <p>{idx}</p>
        </div>
        <div key={idx} className="outputBarDiv">
          <div
            className={barClass}
            key={idx}
            style={{ width: score * 100 + "%" }}
          ></div>
        </div>
      </div>
    );
    //bar.width = score;
    return bar;
  }

  return <div className="outputDiv">{generateResults()}</div>;
}

export default OutputBox;

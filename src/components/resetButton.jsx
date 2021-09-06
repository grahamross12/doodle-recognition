import React from "react";
import "./resetButton.css";

function ResetButton(props) {
  return (
    <div className="resetWrapper">
      <button id="reset" className="btn btn-light" onClick={props.onReset}>
        Reset
      </button>
    </div>
  );
}

export default ResetButton;

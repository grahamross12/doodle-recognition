import React from "react";

function ResetButton(props) {
  return (
    <button className="btn btn-light" onClick={props.onReset}>
      Reset
    </button>
  );
}

export default ResetButton;

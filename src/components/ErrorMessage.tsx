import * as React from "react";

export default class ErrorMessage extends React.Component<ErrorMessageProps, any> {
  render(): JSX.Element {
    let errorWidth = Math.max(400, this.maxWordLength() * 5);
    let errorStyle = {
      position: "fixed",
      top: "50%",
      left: "50%",
      width: `${errorWidth}px`,
      marginTop: "-100px",
      marginLeft: `-${errorWidth / 2}px`,
      padding: "30px",
      backgroundColor: "#bbb",
      textAlign: "center",
      fontFamily: "Arial, Helvetica, sans-serif"
    };

    return (
      <div className="error" style={errorStyle}>
        <h1>ERROR</h1>
        <div className="errorMessage">
          {this.props.message}
        </div>
        <br />
        <button
          className="errorCloseButton"
          onClick={this.props.closeError}>
          OK
        </button>
      </div>
    );
  }

  maxWordLength() {
    let words = this.props.message.split("/\s/");

    if (words.length > 0) {
      return words.sort(word => -word.length)[0].length;
    } else {
      return 0;
    }
  }
}
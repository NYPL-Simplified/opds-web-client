import * as React from "react";
import { popupStyle } from "./styles";

export interface ErrorMessageProps {
  message: string;
  retry?: () => void;
}

export default class ErrorMessage extends React.Component<ErrorMessageProps, any> {
  render(): JSX.Element {
    let errorWidth = Math.max(400, this.maxWordLength() * 5);
    let errorStyle = popupStyle(errorWidth);

    return (
      <div className="error" style={errorStyle}>
        <h1 style={{ marginTop: "0px" }}>Error</h1>
        <div className="errorMessage">
          {this.props.message}
        </div>
        <br />
        <button
          className="retryButton btn btn-default"
          style={{ fontSize: "1.2em" }}
          onClick={this.props.retry}>
          Try again
        </button>&nbsp;&nbsp;
        <button
          className="errorCloseButton btn btn-default"
          style={{ fontSize: "1.2em" }}
          onClick={() => window.history.back() }>
          Go Back
        </button>
      </div>
    );
  }

  maxWordLength() {
    if (typeof this.props.message !== "string") {
      return 0;
    }

    let words = this.props.message.split("/\s/");

    if (words.length > 0) {
      return words.sort(word => -word.length)[0].length;
    } else {
      return 0;
    }
  }
}
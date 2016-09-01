import * as React from "react";
import "../stylesheets/error_message.scss";

export interface ErrorMessageProps {
  message: string;
  retry?: () => void;
}

export default class ErrorMessage extends React.Component<ErrorMessageProps, any> {
  render(): JSX.Element {
    return (
      <div className="error">
        <h1>Error</h1>
        <div className="message">
          {this.props.message}
        </div>
        <br />
        <button
          className="retry-button btn btn-default"
          onClick={this.props.retry}>
          Try again
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
import * as React from "react";

export interface ErrorMessageProps {
  message: string;
  retry?: () => void;
  close?: () => void;
}

/** Shows an error message dialog when a request fails. */
export default class ErrorMessage extends React.Component<
  ErrorMessageProps,
  {}
> {
  render(): JSX.Element {
    return (
      <div className="error" role="dialog" aria-labelledby="error">
        <div>
          <h1 id="error">Error</h1>
          <div className="message">{this.props.message}</div>
          <br />
          {this.props.retry && (
            <button
              className="retry-button btn btn-default"
              onClick={this.props.retry}
            >
              Try again
            </button>
          )}
          {this.props.close && (
            <button
              className="close-button btn btn-default"
              onClick={this.props.close}
            >
              Close
            </button>
          )}
        </div>
      </div>
    );
  }

  maxWordLength() {
    if (typeof this.props.message !== "string") {
      return 0;
    }

    let words = this.props.message.split("/s/");

    if (words.length > 0) {
      return words.sort(word => -word.length)[0].length;
    } else {
      return 0;
    }
  }
}

import * as React from "react";

export interface LinkProps extends React.HTMLProps<any> {
  text?: string; // optional because link can have child elements instead of text
  url: string;
}

abstract class Link<P extends LinkProps> extends React.Component<P, any> {
  render(): JSX.Element {
    return (
      <a
        className={this.props.className}
        style={this.props.style}
        href={this.href()}
        onClick={this.handleClick.bind(this)}>

        { this.props.children || this.props.text }

      </a>
    );
  }

  handleClick(event) {
    // if any of these keys are pressed, the url is opened by the browser as it pleases
    if (event.metaKey || event.altKey || event.ctrlKey || event.shiftKey) {
      return true;
    } else {
      // if not, the url is handled by handleUrl in the child component
      this.processClick();
      event.preventDefault();
      return false;
    }
  }

  abstract href(): string;

  abstract processClick(): void;
}

// Can't "export default abstract class"
// https://github.com/Microsoft/TypeScript/issues/3792
export default Link;
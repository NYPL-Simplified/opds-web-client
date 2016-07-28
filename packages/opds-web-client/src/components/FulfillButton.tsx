import * as React from "react";
const download = require("downloadjs");

export interface FulfillButtonProps extends React.HTMLProps<any> {
  url: string;
  fulfill: (url: string) => Promise<Blob>;
  title: string;
  mimeType: string;
  isSignedIn: boolean;
}

export default class FulfillButton extends React.Component<FulfillButtonProps, any> {
  constructor(props) {
    super(props);
    this.fulfill = this.fulfill.bind(this);
  }

  render() {
    return (
      <span>
        { this.props.isSignedIn ?
          <button
            className="btn btn-default"
            {...this.props}
            onClick={this.fulfill}>
            {this.props.children}
          </button> :
          <a
            className="btn btn-default"
            {...this.props}
            href={this.props.url}
            target="_blank">
            {this.props.children}
          </a>

        }

      </span>
    );
  }

  fulfill() {
    return this.props.fulfill(this.props.url).then(blob => {
      return download(
        blob,
        this.generateFilename(this.props.title),
        // TODO: use mimeType variable once we fix the link type in our OPDS entries
        this.mimeType()
      );

    });
  }

  mimeType() {
    return this.props.mimeType === "vnd.adobe/adept+xml" ? "application/vnd.adobe.adept+xml" : this.props.type;
  }

  generateFilename(str: string): string {
    return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + ".acsm";
  }
}
import * as React from "react";
const download = require("downloadjs");

export interface DownloadButtonProps extends React.HTMLProps<any> {
  url: string;
  mimeType: string;
  isPlainLink?: boolean;
  fulfill?: (url: string) => Promise<Blob>;
  title?: string;
}

export default class DownloadButton extends React.Component<DownloadButtonProps, any> {
  constructor(props) {
    super(props);
    this.fulfill = this.fulfill.bind(this);
  }

  render() {
    return (
      <span>
        { this.props.isPlainLink ?
          <a
            className="btn btn-default"
            {...this.props}
            href={this.props.url}
            target="_blank">
            {this.downloadLabel()}
          </a> :
          <button
            className="btn btn-default"
            {...this.props}
            onClick={this.fulfill}>
            {this.downloadLabel()}
          </button>
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

  generateFilename(str: string): string {
    return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + this.fileExtension();
  }

  mimeType() {
    return this.props.mimeType === "vnd.adobe/adept+xml" ? "application/vnd.adobe.adept+xml" : this.props.mimeType;
  }

  fileExtension() {
    return {
      "application/epub+zip": ".epub",
      "application/pdf": ".pdf",
      "application/vnd.adobe.adept+xml": ".acsm",
      "application/x-mobipocket-ebook": ".mobi"
    }[this.mimeType()] || "";
  }

  downloadLabel() {
    let type = this.fileExtension().replace(".", "").toUpperCase();
    return "Download" + (type ? " " + type : "");
  }
}
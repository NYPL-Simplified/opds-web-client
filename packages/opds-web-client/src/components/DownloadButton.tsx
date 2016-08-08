import * as React from "react";
const download = require("downloadjs");

export interface DownloadButtonProps extends React.HTMLProps<any> {
  url: string;
  mimeType: string;
  isPlainLink?: boolean;
  fulfill?: (url: string) => Promise<Blob>;
  indirectFulfill?: (url: string, type: string) => Promise<string>;
  title?: string;
  indirectType?: string;
}

export default class DownloadButton extends React.Component<DownloadButtonProps, any> {
  constructor(props) {
    super(props);
    this.fulfill = this.fulfill.bind(this);
  }

  render() {
    let props = Object.assign({}, this.props);
    delete props["url"];
    delete props["mimeType"];
    delete props["isPlainLink"];
    delete props["fulfill"];
    delete props["title"];

    return (
      <span>
        { this.props.isPlainLink ?
          <a
            className="btn btn-default"
            {...props}
            href={this.props.url}
            target="_blank">
            {this.downloadLabel()}
          </a> :
          <button
            className="btn btn-default"
            {...props}
            onClick={this.fulfill}>
            {this.downloadLabel()}
          </button>
        }
      </span>
    );
  }

  fulfill() {
    if (this.props.indirectType) {
      return this.props.indirectFulfill(this.props.url, this.props.indirectType).then(url => {
        window.open(url, "_blank");
      });
    } else {
      return this.props.fulfill(this.props.url).then(blob => {
        download(
          blob,
          this.generateFilename(this.props.title),
          // TODO: use mimeType variable once we fix the link type in our OPDS entries
          this.mimeType()
        );
      });
    }
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
    if (this.props.indirectType === "text/html;profile=http://librarysimplified.org/terms/profiles/streaming-media") {
      return "Open in Web Reader";
    }
    let type = this.fileExtension().replace(".", "").toUpperCase();
    return "Download" + (type ? " " + type : "");
  }
}
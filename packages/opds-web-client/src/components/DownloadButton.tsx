import * as React from "react";
import download from "./download";

export interface DownloadButtonProps extends React.HTMLProps<{}> {
  url: string;
  mimeType: string;
  isPlainLink?: boolean;
  fulfill?: (url: string) => Promise<Blob>;
  indirectFulfill?: (url: string, type: string) => Promise<string>;
  title?: string;
  indirectType?: string;
}

/** Shows a button to fulfill and download a book or download it directly. */
export default class DownloadButton extends React.Component<DownloadButtonProps, {}> {
  constructor(props) {
    super(props);
    this.fulfill = this.fulfill.bind(this);
  }

  render() {
    let props = JSON.parse(JSON.stringify(this.props));
    delete props["url"];
    delete props["mimeType"];
    delete props["isPlainLink"];
    delete props["fulfill"];
    delete props["indirectFulfill"];
    delete props["indirectType"];
    delete props["title"];

    return (
      <span>
        { this.props.isPlainLink ?
          <a
            className="btn btn-default download-button"
            {...props}
            href={this.props.url}
            target="_blank">
            {this.downloadLabel()}
          </a> :
          <button
            className={"btn btn-default download-button download-" + this.fileExtension().slice(1) + "-button"}
            {...props}
            onClick={this.fulfill}>
            {this.downloadLabel()}
          </button>
        }
      </span>
    );
  }

  fulfill() {
    if (this.isIndirect()) {
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

  isIndirect() {
    return this.props.indirectType &&
      this.props.mimeType === "application/atom+xml;type=entry;profile=opds-catalog";
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
      return "Read Online";
    }
    let type = this.fileExtension().replace(".", "").toUpperCase();
    return "Download" + (type ? " " + type : "");
  }
}
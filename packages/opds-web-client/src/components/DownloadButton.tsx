import * as React from "react";
import download from "./download";
import { useActions } from "./context/ActionsContext";
import { typeMap, generateFilename } from "../utils/file";

export interface DownloadButtonProps extends React.HTMLProps<{}> {
  url: string;
  mimeType: string;
  isPlainLink?: boolean;
  title?: string;
  indirectType?: string;
}

const DownloadButton: React.FC<DownloadButtonProps> = props => {
  const {
    ref,
    url,
    mimeType,
    isPlainLink,
    indirectType,
    title,
    type,
    ...elementProps
  } = props;
  const { actions, dispatch } = useActions();
  const mimeTypeValue =
    mimeType === "vnd.adobe/adept+xml"
      ? "application/vnd.adobe.adept+xml"
      : mimeType;
  const fulfill = () => {
    let action;
    if (isIndirect && indirectType) {
      action = actions.indirectFulfillBook(url, indirectType);
      return dispatch(action).then(url => {
        window.open(url, "_blank");
      });
    } else {
      // TODO: use mimeType variable once we fix the link type in our
      // OPDS entries
      action = actions.fulfillBook(url);
      return dispatch(action).then(blob => {
        download(
          blob,
          generateFilename(title ?? "untitled", fileExtension(mimeTypeValue)),
          mimeTypeValue
        );
      });
    }
  };
  const isIndirect =
    indirectType &&
    mimeType === "application/atom+xml;type=entry;profile=opds-catalog";
  const fileExtension = (mimeTypeValue: string) =>
    // this ?? syntax is similar to x || y, except that it will only
    // fall back if the predicate is undefined or null, not if it
    // is falsy (false, 0, etc).
    typeMap[mimeTypeValue]?.extension ?? "";
  const downloadLabel = () => {
    if (
      indirectType ===
      "text/html;profile=http://librarysimplified.org/terms/profiles/streaming-media"
    ) {
      return "Read Online";
    }
    let type = typeMap[mimeTypeValue]?.name;
    return `Download${type ? " " + type : ""}`;
  };
  const baseClassName = "btn btn-default download-button";
  const buttonClassName = `${baseClassName} download-${fileExtension(
    mimeTypeValue
  ).slice(1)}-button`;

  return (
    <span>
      {isPlainLink ? (
        <a
          href={url}
          target="_blank"
          {...elementProps}
          className={baseClassName}
        >
          {downloadLabel()}
        </a>
      ) : (
        <button onClick={fulfill} {...elementProps} className={buttonClassName}>
          {downloadLabel()}
        </button>
      )}
    </span>
  );
};

export default DownloadButton;

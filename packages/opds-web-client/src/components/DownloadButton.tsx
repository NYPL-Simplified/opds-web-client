import * as React from "react";
import useDownloadButton from "../hooks/useDownloadButton";
import { MediaLink, FulfillmentLink } from "./../interfaces";

export type DownloadButtonProps = React.ComponentProps<"button"> &
  React.ComponentProps<"a"> & {
    isPlainLink?: boolean;
    title: string;
    link: MediaLink | FulfillmentLink;
  };

const DownloadButton: React.FC<DownloadButtonProps> = props => {
  const { ref, isPlainLink, link, title, ...elementProps } = props;

  const { mimeType, fulfill, downloadLabel, fileExtension } = useDownloadButton(
    link,
    title
  );

  const baseClassName = "btn btn-default download-button";
  const buttonClassName = `${baseClassName} download-${fileExtension.slice(
    1
  )}-button`;

  return (
    <span>
      {isPlainLink ? (
        <a
          href={link.url}
          target="_blank"
          {...elementProps}
          className={baseClassName}
        >
          {downloadLabel}
        </a>
      ) : (
        <button onClick={fulfill} {...elementProps} className={buttonClassName}>
          {downloadLabel}
        </button>
      )}
    </span>
  );
};

export default DownloadButton;

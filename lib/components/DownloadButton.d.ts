import * as React from "react";
import { MediaLink, FulfillmentLink } from "./../interfaces";
export declare type DownloadButtonProps = React.ComponentProps<"button"> & React.ComponentProps<"a"> & {
    isPlainLink?: boolean;
    title: string;
    link: MediaLink | FulfillmentLink;
};
declare const DownloadButton: React.FC<DownloadButtonProps>;
export default DownloadButton;

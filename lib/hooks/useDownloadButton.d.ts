import { MediaLink, FulfillmentLink, MediaType } from "./../interfaces";
export declare function fixMimeType(mimeType: MediaType | "vnd.adobe/adept+xml"): MediaType;
export declare const STREAMING_MEDIA_LINK_TYPE: MediaType;
declare type DownloadDetails = {
    fulfill: () => Promise<void>;
    isIndirect: boolean;
    downloadLabel: string;
    mimeType: MediaType;
    fileExtension: string;
    isStreaming: boolean;
};
/**
 * We use typescript function overloads to show that if you pass in a link
 * you are guaranteed to get the download button details in an object. If
 * you might pass in undefined, you might get null
 */
export default function useDownloadButton(link: MediaLink | FulfillmentLink, title: string): DownloadDetails;
export default function useDownloadButton(link: MediaLink | FulfillmentLink | undefined, title: string): DownloadDetails | null;
export {};

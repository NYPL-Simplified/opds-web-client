import * as React from "react";
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
    constructor(props: any);
    render(): JSX.Element;
    fulfill(): Promise<void>;
    isIndirect(): boolean;
    generateFilename(str: string): string;
    mimeType(): string;
    fileExtension(): any;
    downloadLabel(): string;
}

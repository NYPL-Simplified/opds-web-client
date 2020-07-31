import { MediaType } from "./../interfaces";
export declare const typeMap: Record<MediaType, {
    extension: string;
    name: string;
}>;
export declare const generateFilename: (str: string, extension: string) => string;

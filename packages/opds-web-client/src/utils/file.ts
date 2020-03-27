import { MediaType } from "./../interfaces";

type TypeMap = {
  [key in MediaType]: {
    extension: string;
    name: string;
  };
};

export const typeMap: TypeMap = {
  "application/epub+zip": {
    extension: ".epub",
    name: "EPUB"
  },
  "application/kepub+zip": {
    // got this from here: https://wiki.mobileread.com/wiki/Kepub
    extension: ".kepub.epub",
    name: "KEPUB"
  },
  "application/pdf": {
    extension: ".pdf",
    name: "PDF"
  },
  "application/vnd.adobe.adept+xml": {
    extension: ".acsm",
    name: "ACSM"
  },
  "vnd.adobe/adept+xml": {
    extension: ".acsm",
    name: "ACSM"
  },
  "application/x-mobipocket-ebook": {
    extension: ".mobi",
    name: "MOBI"
  },
  "application/x-mobi8-ebook": {
    extension: ".azw3",
    name: "Mobi8"
  },
  "application/atom+xml;type=entry;profile=opds-catalog": {
    extension: "",
    name: "atom"
  },
  "text/html;profile=http://librarysimplified.org/terms/profiles/streaming-media": {
    extension: "",
    name: "streaming-media"
  }
};

export const generateFilename = (str: string, extension: string) => {
  return (
    str
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") + extension
  );
};

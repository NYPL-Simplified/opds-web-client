import { MediaType } from "./../interfaces";

export const typeMap: Record<MediaType, { extension: string; name: string }> = {
  "application/vnd.overdrive.circulation.api+json;profile=audiobook": {
    extension: "",
    name: "Overdrive Audiobook"
  },
  "application/vnd.overdrive.circulation.api+json;profile=ebook": {
    extension: "",
    name: "Overdrive eBook"
  },
  "application/epub+zip": {
    extension: ".epub",
    name: "EPUB"
  },
  "application/vnd.librarysimplified.axisnow+json": {
    extension: ".json",
    name: "AxisNow eBook"
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
  'text/html;profile="http://librarysimplified.org/terms/profiles/streaming-media"': {
    extension: "",
    name: "streaming-media"
  },
  "application/audiobook+json": {
    extension: ".audiobook",
    name: "Audiobook"
  },
  "application/vnd.readium.lcp.license.v1.0+json": {
    extension: ".lcpl",
    name: "LCP license"
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

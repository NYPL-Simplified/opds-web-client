export const typeMap = {
  "application/epub+zip": {
    extension: ".epub",
    name: "ePub"
  },
  "application/pdf": {
    extension: ".pdf",
    name: "PDF"
  },
  "application/vnd.adobe.adept+xml": {
    extension: ".acsm",
    name: "ACSM"
  },
  "application/x-mobipocket-ebook": {
    extension: ".mobi",
    name: "MOBI"
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

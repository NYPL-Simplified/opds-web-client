const download: any = (blob: any, filename: string, mimeType: string) => {
  (window as any).__downloadjsBlob = blob;
  (window as any).__downloadjsFilename = filename;
  (window as any).__downloadjsMimeType = mimeType;
};

download.getBlob = () => (window as any).__downloadjsBlob;
download.getFilename = () => (window as any).__downloadjsFilename;
download.getMimeType = () => (window as any).__downloadjsMimeType;

export = download;

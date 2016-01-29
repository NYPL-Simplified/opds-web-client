interface OPDSCollection {
  title: string,
  url: string,
}

interface OPDSEntry {
  id: string,
  title: string,
  type: string,
  author: string,
  summary?: string,
  updated: string,
  imageUrl: string,
  infoUrl?: string,
  language: string,
  publisher: string,
  collection?: OPDSCollection,
  // status: string,
  // copiesAvailable: number,
  // copiesTotal: number,
}

interface OPDSFeed {
  id: string,
  title: string,
  updated: string,
  link: string,
  entries: OPDSEntry[],
}
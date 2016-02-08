import { feedToCollection } from "./OPDSDataAdapter";
import OPDSParser from "opds-feed-parser";

export function fetchOPDSData(feedUrl) {
  let parser = new OPDSParser;

  return new Promise((resolve, reject) => {
    fetch("/proxy", {
      method: "post",
      headers: {
        "Content-type": "application/x-www-form-urlencoded"
      },
      body: "url=" + feedUrl
    }).then(response => response.text()).then(body => {
      parser.parse(body).then((opdsFeed) => {
        let collectionData = feedToCollection(opdsFeed, feedUrl);
        resolve(collectionData);
      });
    }).catch(err => {
      reject(err);
    });
  });
}
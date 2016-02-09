import { feedToCollection } from './OPDSDataAdapter';
import OPDSParser from 'opds-feed-parser';

export function fetchOPDSData(feedUrl) {
  let parser = new OPDSParser;

  return new Promise((resolve, reject) => {
    fetchData(feedUrl).then((response: string) => {
      parser.parse(response).then((opdsFeed) => {
        let collectionData = feedToCollection(opdsFeed, feedUrl);
        resolve(collectionData);
      }).catch(err => {
        reject(err);
      });
    }).catch(err => {
      reject(err);
    });
  });
}

export default function fetchData(url) {
  let httpRequest = new XMLHttpRequest();

  return new Promise((resolve, reject) => {
    httpRequest.onreadystatechange = () => {
      if (httpRequest.readyState === XMLHttpRequest.DONE) {
        if (httpRequest.status === 200) {
          resolve(httpRequest.responseText);
        } else {
          reject("Could not fetch data: " + url);
        }
      }
    }

    httpRequest.open('POST', "/proxy", true);
    httpRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    httpRequest.send("url=" + encodeURIComponent(url));
  });
}
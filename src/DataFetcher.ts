import { feedToCollection, entryToBook } from "./OPDSDataAdapter";
import OPDSParser, { OPDSFeed, OPDSEntry } from "opds-feed-parser";
import OpenSearchDescriptionParser from "./OpenSearchDescriptionParser";

export default class DataFetcher {
  private proxyUrl: string;

  constructor(proxyUrl: string) {
    this.proxyUrl = proxyUrl;
  }

  fetchOPDSData(url: string) {
    let parser = new OPDSParser;

    return new Promise((resolve, reject) => {
      this.fetchData(url).then((response: string) => {
        parser.parse(response).then((parsedData: OPDSFeed | OPDSEntry) => {
          if (parsedData instanceof OPDSFeed) {
            let collectionData = feedToCollection(parsedData, url);
            resolve(collectionData);
          } else if (parsedData instanceof OPDSEntry) {
            let bookData = entryToBook(parsedData, url);
            resolve(bookData);
          } else {
            reject("parsed data must be OPDSFeed or OPDSEntry");
          }
        }).catch(err => {
          reject(err);
        });
      }).catch(err => {
        reject(err);
      });
    });
  }

  fetchSearchDescriptionData(searchDescriptionUrl: string) {
    let parser = new OpenSearchDescriptionParser;

    return new Promise((resolve, reject) => {
      this.fetchData(searchDescriptionUrl).then((response: string) => {
        parser.parse(response, searchDescriptionUrl).then((openSearchDescription) => {
          resolve(openSearchDescription);
        }).catch(err => reject(err));
      }).catch(err => reject(err));
    });
  }

  fetchData(url: string) {
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
      };

    if (this.proxyUrl) {
      httpRequest.open("POST", this.proxyUrl, true);
      httpRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      httpRequest.send("url=" + encodeURIComponent(url));
    } else {
      httpRequest.open("GET", url);
      httpRequest.send();
    }
    });
  }
}
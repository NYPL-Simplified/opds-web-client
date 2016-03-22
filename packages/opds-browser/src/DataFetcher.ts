import { feedToCollection, entryToBook } from "./OPDSDataAdapter";
import OPDSParser, { OPDSFeed, OPDSEntry } from "opds-feed-parser";
import OpenSearchDescriptionParser from "./OpenSearchDescriptionParser";

export default class DataFetcher {
  private proxyUrl: string;
  private adapter: any;

  constructor(proxyUrl?: string, adapter?: any) {
    this.proxyUrl = proxyUrl;
    this.adapter = adapter;
  }

  fetchOPDSData(url: string) {
    let parser = new OPDSParser;

    return new Promise((resolve, reject) => {
      this.fetchData(url).then((response: string) => {
        parser.parse(response).then((parsedData: OPDSFeed | OPDSEntry) => {
          resolve(this.adapter(parsedData, url));
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
            reject({
              status: httpRequest.status,
              response: httpRequest.response,
              url: url
            });
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

  fetch(url: string, options = {}) {
    if (this.proxyUrl) {
      let formData = new FormData();
      formData.append("url", encodeURIComponent(url));
      options = Object.assign(options, {
        method: "POST",
        body: formData
      });
      return fetch(this.proxyUrl, options);
    } else {
      return fetch(url, options);
    }
  }
}
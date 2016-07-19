import { feedToCollection, entryToBook } from "./OPDSDataAdapter";
import OPDSParser, { OPDSFeed, OPDSEntry } from "opds-feed-parser";
import OpenSearchDescriptionParser from "./OpenSearchDescriptionParser";
require("isomorphic-fetch");
import { basicAuth } from "./auth";

export interface RequestError {
  status: number;
  response: string;
  url: string;
}

export interface RequestRejector {
  (err: RequestError): any;
}

export default class DataFetcher {
  private proxyUrl: string;
  private adapter: any;
  private auth: any;

  constructor(config: {
    proxyUrl?: string;
    adapter?: any;
    auth?: any;
  } = {}) {
    this.proxyUrl = config.proxyUrl;
    this.adapter = config.adapter;
    this.auth = config.auth;
  }

  fetchOPDSData(url: string) {
    let parser = new OPDSParser;

    return new Promise((resolve, reject: RequestRejector) => {
      this.fetch(url).then(response => {
        response.text().then(text => {
          if (response.status === 401) {
            reject({
              status: 401,
              response: text,
              url: url
            });
          }

          parser.parse(text).then((parsedData: OPDSFeed | OPDSEntry) => {
            resolve(this.adapter(parsedData, url));
          }).catch(err => {
            reject({
              status: null,
              response: "Failed to parse OPDS data",
              url: url
            });
          });
        });
      }).catch(reject);
    });
  }

  fetchSearchDescriptionData(searchDescriptionUrl: string) {
    let parser = new OpenSearchDescriptionParser;

    return new Promise((resolve, reject: RequestRejector) => {
      this.fetch(searchDescriptionUrl).then(response => {
        response.text().then(text => {
          if (response.status === 401) {
            reject({
              status: 401,
              response: text,
              url: searchDescriptionUrl
            });
          }

          parser.parse(text, searchDescriptionUrl).then((openSearchDescription) => {
            resolve(openSearchDescription);
          }).catch(err => {
            reject({
              status: null,
              response: "Failed to parse OPDS data",
              url: searchDescriptionUrl
            });
          });
        });
      }).catch(reject);
    });
  }

  fetch(url: string, options = {}) {
    options = Object.assign({ credentials: "same-origin" }, options);

    if (this.proxyUrl) {
      let formData = new FormData();
      formData.append("url", url);
      Object.assign(options, {
        method: "POST",
        body: formData
      });
      url = this.proxyUrl;
    }

    if (this.auth) {
      options["headers"] = this.auth.prepareHeaders(options["headers"]);
    }

    return fetch(url, options);
  }
}
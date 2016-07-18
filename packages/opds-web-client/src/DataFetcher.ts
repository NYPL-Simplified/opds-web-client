import { feedToCollection, entryToBook } from "./OPDSDataAdapter";
import OPDSParser, { OPDSFeed, OPDSEntry } from "opds-feed-parser";
import OpenSearchDescriptionParser from "./OpenSearchDescriptionParser";
require("isomorphic-fetch");

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
  private basicAuthCredentials: any;

  constructor(config: {
    proxyUrl?: string;
    adapter?: any;
    basicAuthCredentials?: any;
  } = {}) {
    this.proxyUrl = config.proxyUrl;
    this.adapter = config.adapter;
    this.basicAuthCredentials = config.basicAuthCredentials;
  }

  setBasicAuthCredentials(credentials: string) {
    this.basicAuthCredentials = credentials;
  }

  fetchOPDSData(url: string) {
    let parser = new OPDSParser;

    return new Promise((resolve, reject: RequestRejector) => {
      this.fetch(url).then((response) => {
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
      }).catch(err => {
        reject(err)
      });
    });
  }

  fetchSearchDescriptionData(searchDescriptionUrl: string) {
    let parser = new OpenSearchDescriptionParser;

    return new Promise((resolve, reject: RequestRejector) => {
      this.fetch(searchDescriptionUrl).then((response) => {
        response.text().then(text => {
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
      }).catch((err: RequestError) => reject(err));
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

    options["headers"] = options["headers"] || {};

    // server needs to know request came from JS in order to omit
    // 'Www-Authenticate: Basic' header, which triggers browser's
    // basic auth popup
    Object.assign(options["headers"], {
      "X-Requested-With": "XMLHttpRequest"
    });

    if (this.basicAuthCredentials) {
      Object.assign(options["headers"], {
        Authorization: "Basic " + this.basicAuthCredentials
      });
    }

    return fetch(url, options);
  }
}
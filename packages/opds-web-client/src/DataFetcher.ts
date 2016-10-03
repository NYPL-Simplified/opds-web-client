import { feedToCollection, entryToBook } from "./OPDSDataAdapter";
import OPDSParser, { OPDSFeed, OPDSEntry } from "opds-feed-parser";
import OpenSearchDescriptionParser from "./OpenSearchDescriptionParser";
import { AuthCredentials } from "./interfaces";
const Cookie = require("js-cookie");
require("isomorphic-fetch");

export interface RequestError {
  status: number;
  response: string;
  url: string;
  headers?: any;
}

export interface RequestRejector {
  (err: RequestError): any;
}

export default class DataFetcher {
  public authKey: string;
  private proxyUrl: string;
  private adapter: any;

  constructor(config: {
    proxyUrl?: string;
    adapter?: any;
  } = {}) {
    this.proxyUrl = config.proxyUrl;
    this.adapter = config.adapter;
    this.authKey = "authCredentials";
  }

  fetchOPDSData(url: string) {
    let parser = new OPDSParser;

    return new Promise((resolve, reject: RequestRejector) => {
      this.fetch(url).then(response => {
        response.text().then(text => {
          if (this.isErrorCode(response.status)) {
            reject({
              status: response.status,
              response: text,
              url: url,
              headers: response.headers
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
          if (this.isErrorCode(response.status)) {
            reject({
              status: response.status,
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
      let formData = new (window as any).FormData();
      formData.append("url", url);
      Object.assign(options, {
        method: "POST",
        body: formData
      });
      url = this.proxyUrl;
    }

    options["headers"] = this.prepareAuthHeaders(options["headers"]);

    return fetch(url, options);
  }

  setAuthCredentials(credentials: AuthCredentials): void {
    if (credentials) {
      Cookie.set(this.authKey, JSON.stringify(credentials));
    }
  }

  getAuthCredentials(): AuthCredentials {
    let credentials = Cookie.get(this.authKey);
    if (credentials) {
      return JSON.parse(credentials);
    }
  }

  clearAuthCredentials(): void {
    Cookie.remove(this.authKey);
  }

  prepareAuthHeaders(headers: any = {}): any {
    // server needs to know request came from JS in order to omit
    // 'Www-Authenticate: Basic' header, which triggers browser's
    // ugly basic auth popup
    headers["X-Requested-With"] = "XMLHttpRequest";

    let credentials = this.getAuthCredentials();
    if (credentials) {
      headers["Authorization"] = credentials.credentials;
    }

    return headers;
  }

  isErrorCode(status: number) {
    return status < 200 || status >= 400;
  }
}
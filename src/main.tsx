import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Root from './components/Root';
import OPDSParser = require("opds-feed-parser");
import { feedToCollection } from "./OPDSDataAdapter";

let parser = new OPDSParser.default();

//let feedUrl = "http:\/\/oacontent.alpha.librarysimplified.org/preload";
//let feedUrl = "http:\/\/oacontent.alpha.librarysimplified.org";
// let feedUrl = "https:\/\/circulation.librarysimplified.org/feed/eng/English%20-%20Best%20Sellers?order=author";
let feedUrl = "https:\/\/circulation.librarysimplified.org";
// let feedUrl = "http:\/\/feedbooks.github.io/opds-test-catalog/catalog/root.xml";

var httpRequest = new XMLHttpRequest();
httpRequest.onreadystatechange = () => {
  if (httpRequest.readyState === XMLHttpRequest.DONE) {
    if (httpRequest.status === 200) {
      let response = httpRequest.responseText;
      let promise = parser.parse(response);
      promise.then((opdsFeed) => {
        let collectionData = feedToCollection(opdsFeed, feedUrl);
        ReactDOM.render(
          <Root {...collectionData} />,
          document.getElementById("opds-browser")
        );
      });
    }
  }
}

httpRequest.open('POST', "/proxy", true);
httpRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
httpRequest.send("url=" + feedUrl);


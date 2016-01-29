/// <reference path='../typings/tsd.d.ts'/>

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Root from './components/Root';

// import parser from 'opds-feed-parser';
// import * request from 'request';

// request("http://feedbooks.github.io/opds-test-catalog/catalog/acquisition/blocks.xml", (error, response, body) => {
//   new parser().parse(body).then((feed) => { 
//     Object.freeze(feed);
//     console.log(feed);

//     ReactDOM.render(
//       <Root {...testCollectionData} />,
//       document.getElementById("opds-browser")
//     );
    
//   });
// });

import testCollectionData from './testCollectionData';

ReactDOM.render(
  <Root {...testCollectionData} />,
  document.getElementById("opds-browser")
);
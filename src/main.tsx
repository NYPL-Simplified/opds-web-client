/// <reference path='../typings/tsd.d.ts'/>
/// <reference path='../node_modules/immutable/dist/immutable.d.ts'/>

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Root from './components/Root';

import testCollectionData from './testCollectionData';
Object.freeze(testCollectionData);

ReactDOM.render(
  <Root {...testCollectionData} />,
  document.getElementById("opds-browser")
);

/// <reference path='../typings/tsd.d.ts'/>
/// <reference path='../node_modules/immutable/dist/immutable.d.ts'/>

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Root from './components/Root';
import { Map } from 'immutable';

import testFeedData from '../__tests__/testFeedData';
Object.freeze(testFeedData);

ReactDOM.render(
  <Root {...testFeedData} />,
  document.getElementById("opds-browser")
);
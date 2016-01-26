/// <reference path='../typings/tsd.d.ts'/>

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Root from 'components/Root';

let rootProps = {
  feed: {
    id: '/groups/',
    title: 'All Books',
    updated: '2016-01-26T15:17:03Z',
    link: '/groups/',
    entries: []
  }
}

ReactDOM.render(
  <Root props={rootProps} />,
  document.getElementById("opds-browser");
);
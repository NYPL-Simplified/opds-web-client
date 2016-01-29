jest.dontMock('../src/components/Collection');

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as TestUtils from 'react-addons-test-utils';
const Collection = require('../src/components/Collection');

describe('Collection', () => {
  let collectionData = { id: "/books", title: "All Books" };

  it('shows the collection title', () => {
    let collection = TestUtils.renderIntoDocument(
      <Collection {...collectionData} /> 
    );
    let titleElement = ReactDOM.findDOMNode(collection);
    expect(titleElement.textContent).toEqual(collectionData.title);
  });
});

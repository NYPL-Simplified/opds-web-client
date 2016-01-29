jest.dontMock('../src/components/Collection');
jest.dontMock('../src/testOPDSData');
jest.dontMock('../src/testCollectionData');
jest.dontMock('../src/OPDSDataAdapter');

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as TestUtils from 'react-addons-test-utils';
const Collection = require('../src/components/Collection');
const testCollectionData = require('../src/testCollectionData');

describe('Collection', () => {
  it('shows the feed title', () => {
    let collection = TestUtils.renderIntoDocument(
      <Collection {...testCollectionData} /> 
    );
    let titleElement = ReactDOM.findDOMNode(collection);
    expect(titleElement.textContent).toEqual(testCollectionData.title);
  });
});

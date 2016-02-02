jest.dontMock('../Collection');
jest.dontMock('../Lane');
jest.dontMock('../Book');

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as TestUtils from 'react-addons-test-utils';

import Collection from '../Collection';
import Lane from '../Lane';
import Book from '../Book';
import collectionData from './collectionData';

describe('Collection', () => {
  it('shows the collection title', () => {
    let collection = TestUtils.renderIntoDocument(
      <Collection {...collectionData} />
    );
    let titleElement = TestUtils.findRenderedDOMComponentWithTag(collection, "h1");
    expect(titleElement.textContent).toEqual(collectionData.title);
  });
  
  it('shows books', () => {    
    let collection = TestUtils.renderIntoDocument(
      <Collection {...collectionData} /> 
    );
    let books = TestUtils.scryRenderedComponentsWithType(collection, Book);
    // count books in all lanes plus books directly belonging to this collection
    let bookCount = collectionData.books.length + collectionData.lanes.reduce((count, lane) => { 
      return count + lane.books.length;
    }, 0);
    expect(books.length).toEqual(bookCount);
  });

  it('shows lanes', () => {    
    let collection = TestUtils.renderIntoDocument(
      <Collection {...collectionData} /> 
    );
    let lanes = TestUtils.scryRenderedComponentsWithType(collection, Lane);
    expect(lanes.length).toEqual(collectionData.lanes.length);
  });
});

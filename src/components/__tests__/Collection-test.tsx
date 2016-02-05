jest.dontMock('../Collection');
jest.dontMock('../Lane');
jest.dontMock('../Book');
jest.dontMock('../LaneBook');

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as TestUtils from 'react-addons-test-utils';

import Collection from '../Collection';
import Lane from '../Lane';
import Book from '../Book';
import LaneBook from '../LaneBook';
import { groupedCollectionData, ungroupedCollectionData } from './collectionData';

describe('Collection', () => {
  describe('collection with lanes', () => {
    let collectionData: CollectionProps = groupedCollectionData;
    let collection: Collection;

    beforeEach(() => {
      collection = TestUtils.renderIntoDocument(
        <Collection {...collectionData} />
      );
    });

    it('shows the collection title', () => {
      let titleElement = TestUtils.findRenderedDOMComponentWithTag(collection, "h1");
      expect(titleElement.textContent).toEqual(collectionData.title);
    });

    it('shows books', () => {
      let books = TestUtils.scryRenderedComponentsWithType(collection, Book);
      let bookCount = collectionData.lanes.reduce((count, lane) => {
        return count + lane.books.length;
      }, 0);
      expect(books.length).toEqual(bookCount);
    });

    it('shows lanes in order', () => {
      let lanes = TestUtils.scryRenderedComponentsWithType(collection, Lane);
      expect(lanes.length).toEqual(collectionData.lanes.length);
    });

    it('shows lanes in order', () => {
      let lanes = TestUtils.scryRenderedComponentsWithType(collection, Lane);
      let laneTitles = lanes.map(lane => lane.props.title);
      expect(laneTitles).toEqual(collectionData.lanes.map(lane => lane.title));
    });
  });

  describe('collection without lanes', () => {
    let collectionData = ungroupedCollectionData;
    let collection: Collection;

    beforeEach(() => {
      collection = TestUtils.renderIntoDocument(
        <Collection {...collectionData} />
      );
    });

    it('shows books', () => {
      let collection = TestUtils.renderIntoDocument(
        <Collection {...collectionData} />
      );
      let books: LaneBook[] = TestUtils.scryRenderedComponentsWithType(collection, LaneBook);
      // count books in all lanes plus books directly belonging to this collection
      let bookCount = collectionData.books.length + collectionData.lanes.reduce((count, lane) => {
        return count + lane.books.length;
      }, 0);
      expect(books.length).toEqual(bookCount);
    });

    it('shows books in order', () => {
      let collection = TestUtils.renderIntoDocument(
        <Collection {...collectionData} />
      );
      let books: Book[] = TestUtils.scryRenderedComponentsWithType(collection, Book);
      let bookTitles = books.map(book => book.props.title);
      expect(bookTitles).toEqual(collectionData.books.map(book => book.title));
    });
  });

});

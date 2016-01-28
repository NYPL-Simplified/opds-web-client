jest.dontMock('../src/components/Feed');

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as TestUtils from 'react-addons-test-utils';
import Feed from '../src/components/Feed';
import testFeedData from './testFeedData'; 

describe('Feed', () => {

  it('shows the feed title', () => {
    let feedProps = testFeedData.feed;

    let feed = TestUtils.renderIntoDocument(
      <Feed {...feedProps} />
    );

    let titleElement = TestUtils.findRenderedDOMComponentWithTag(feed, "h1");

    expect(titleElement.textContent).toEqual(feedProps.title);
  });
});
jest.dontMock('../Link');

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as TestUtils from 'react-addons-test-utils';

import Link from '../Link';

let link = {
  id: 'root.xml',
  title: 'First Acquisition feed',
  href: 'acquisition/main.xml'
};

describe('Link', () => {
  it('shows the link', () => {
    let renderedLink = TestUtils.renderIntoDocument(
      <Link {...link} />
    );

    let linkElement = TestUtils.findRenderedDOMComponentWithTag(renderedLink, 'a');
    expect(linkElement.textContent).toEqual(link.title);
  });
});
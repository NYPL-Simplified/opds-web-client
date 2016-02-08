jest.dontMock('../Facet');

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as TestUtils from 'react-addons-test-utils';

import Facet from '../Facet';

describe('Facet', () => {
  it("shows facet link", () => {
    let facet = {
      label: "Available now",
      href: "href",
      active: true
    };

    let renderedFacet = TestUtils.renderIntoDocument(
      <Facet {...facet} />
    );

    let link = TestUtils.findRenderedDOMComponentWithTag(renderedFacet, 'a');
    expect(link.textContent).toEqual(facet.label);
  });

  it("is clickable to navigate to facet", () => {
    let fetchUrl = jest.genMockFunction();
    let facet = {
      label: "Available now",
      href: "href",
      active: true,
      fetchUrl: fetchUrl
    };

    let renderedFacet = TestUtils.renderIntoDocument(
      <Facet {...facet} />
    );

    let link = TestUtils.findRenderedDOMComponentWithTag(renderedFacet, 'a');
    TestUtils.Simulate.click(link);

    expect(fetchUrl.mock.calls.length).toEqual(1);
    expect(fetchUrl.mock.calls[0][0]).toEqual('href');
  });
});
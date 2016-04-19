import * as React from "react";

export const mockRouter = (push) => {
  return {
    push,
    createHref: (location) => "test href",
    isActive: (location, onlyActiveOnIndex) => true
  };
};

export const mockRouterContext = (push?, pathFor?) => {
  return {
    router: mockRouter(push || jest.genMockFunction()),
    pathFor: pathFor || ((collectionUrl, bookUrl) => collectionUrl + "::" + bookUrl)
  };
};

export interface TestContextProps {
  push?: any;
  pathFor?: (collectionUrl: string, bookurl: string) => string;
  [key: string]: any;
}

function withRouterContext<P>(ComposedComponent: React.ComponentClass<P>): React.ComponentClass<P & TestContextProps> {
  return React.createClass<P & TestContextProps, any>({
    wrappedInstance: null,

    childContextTypes: {
      router: React.PropTypes.object.isRequired,
      pathFor: React.PropTypes.func.isRequired
    },

    getChildContext: function() {
      return mockRouterContext(this.props.push, this.props.pathFor);
    },

    render: function(): JSX.Element {
      let that = this;
      let props = Object.assign({ ref: (c) => { that.wrappedInstance = c; } }, this.props);
      return React.createElement<P>(ComposedComponent, props);
    },

    getWrappedInstance(): React.ComponentClass<P> {
      return this.wrappedInstance;
    }
  });
}

export default withRouterContext;
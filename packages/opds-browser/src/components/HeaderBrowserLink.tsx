import * as React from "react";
import BrowserLink, { BrowserLinkProps } from "./BrowserLink";

export default class HeaderBrowserLink extends BrowserLink {
  render(): JSX.Element {
    let props = Object.assign({ isTopLevel: true }, this.props);
    return (
      <BrowserLink {...props} />
    );
  }
}
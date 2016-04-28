# opds-browser
JavaScript OPDS feed browser

## Standalone App
OPDS Browser can be run as a standalone app mounted in a DOM element:

```javascript
new OPDSBrowserApp(config, elementId);
```

For an example of OPDS Browser in use as a standalone app, see the [demo server template](packages/server/views/index.html.ejs) included in this repository .

### Standalone Config Options

- `pathFor(collectionUrl: string, bookUrl: string) => string`: required function that accepts a collection URL and book URL and returns a string that will become the web browser's relative URL upon navigating to a new collection or book
- `pathPattern`: a react-router [RoutePattern](reactjs/react-router/blob/master/docs/Glossary.md#routepattern) representing how to map a web browser URL to a collectionUrl and bookUrl. Default: `/(collection/:collectionUrl/)(book/:bookUrl/)`
- `collectionUrl`: optional initial URL of an OPDS feed to load. Default: `null` (allow user to enter URL)
- `bookUrl`: optional initial URL of an OPDS Entry to load. Default: `null`
- `proxyUrl`: optional local proxy path to which all remote URLs will be posted. Default: `undefined`
- `pageTitleTemplate(collectionTitle: string, bookTitle: string) => string`: optional function that accepts a collection and book title and returns an HTML page title. Default: `undefined`

## React Component
OPDSBrowser is also available as a reusable React component:

```jsx
import OPDSBrowser from "opds-browser";

ReactDOM.render(
  <OPDSBrowser
    collectionUrl={this.props.collectionUrl}
    bookUrl={this.props.bookUrl}
    isTopLevel={this.props.isTopLevel}
    pageTitleTemplate={this.pageTitleTemplate}
    BookDetailsContainer={BookDetailsContainer}
    Header={Header}
    />
);
```

For an example of OPDS Browser in use as a React component, see [NYPL-Simplified/circulation-web].

### React Component Props

- `collectionUrl`: optional URL of an OPDS Acquisition or Navigation feed to load. Default: `null`
- `bookUrl`: optional URL of an OPDS Entry to load. Default: `null`
- `isTopLevel`: optional boolean, if `true` and accompanying a `collectionUrl`, then in the breadcrumbs section of the browser the provided collection will be displayed immediately after the catalog root. If `false`, the provided collection will generally be added to the end of the existing breadcrumbs. Default: `false`
- `pageTitleTemplate(collectionTitle: string, bookTitle: string) => string`: optional function that accepts a collection and book title and returns an HTML page title. Default: `undefined`
- `Header`: optional custom React component class to render in place of OPDS Browser's default header. This `Header` will receive one prop, `BrowserLink` which should be used for links to collections or books that OPDS Browser should load, and one child, a `Search` component that will only be present when the loaded collection links to an Open Search Description document. Default: `undefined`
- `BookDetailsContainer`: optional custom React component class to render in place of OPDS Browser's default `BookDetails` component. This `BookDetailsContainer` will receive three props: the current `collectionUrl` and `bookUrl`, and `refreshBrowser`, a function that can be called to refresh the collection and/or book. `BookDetailsContainer` will also receive the default rendered `BookDetails` component as a child. Default: `undefined`

### React Component Context

The OPDSBrowser React component should be rendered within a [React context](https://facebook.github.io/react/docs/context.html) that includes two items:

- `router`: any object that implements the `push`, `createHref`, and `isActive` methods of react-router's [context.router](https://github.com/reactjs/react-router/blob/master/docs/API.md#contextrouter)
- `pathFor(collectionUrl: string, bookUrl: string) => string`: a function that accepts a collection URL and book URL and returns a string that will become the web browser's relative URL upon navigating to a new collection or book

## License

```
Copyright © 2015 The New York Public Library, Astor, Lenox, and Tilden Foundations

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```

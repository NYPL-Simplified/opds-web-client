# opds-web-client
JavaScript OPDS web client

## Standalone App
OPDS Web Client can be run as a standalone app mounted in a DOM element:

```javascript
new OPDSWebClient(config, elementId);
```

For an example of OPDS Web Client in use as a standalone app, see the [demo server template](https://github.com/NYPL-Simplified/opds-web-client/blob/master/packages/server/views/index.html.ejs) included in this repository.

*NOTE*: The web reader has been taken out of the demo server template for now as it is causing build issues. If you want to install it locally and use it for testing, uncomment line 17 in `/packages/server/index.js`, and install it in the `/packages/server` directory:

```bash
 $ npm install --save nypl-simplified-webpub-viewer
```

### Standalone Config Options

- `pathFor(collectionUrl: string, bookUrl: string) => string`: required function that accepts a collection URL and book URL and returns a string that will become the web browser's relative URL upon navigating to a new collection or book
- `pathPattern`: a react-router [path pattern](https://reacttraining.com/react-router/core/api/Route/path-string-string) representing how to map a web browser URL to a collectionUrl and bookUrl. Default: `/(collection/:collectionUrl/)(book/:bookUrl/)`
- `collectionUrl`: optional initial URL of an OPDS feed to load. Default: `null` (allow user to enter URL)
- `bookUrl`: optional initial URL of an OPDS Entry to load. Default: `null`
- `proxyUrl`: optional local proxy path to which all remote URLs will be posted. Default: `undefined`
- `pageTitleTemplate(collectionTitle: string, bookTitle: string) => string`: optional function that accepts a collection and book title and returns an HTML page title. Default: `undefined`
- `authPlugins`: optional list of objects that implement the [`AuthPlugin` interface](http://nypl-simplified.github.io/opds-web-client/interfaces/authplugin.html). Default: [`BasicAuthPlugin`](http://nypl-simplified.github.io/opds-web-client/globals.html#basicauthplugin)
- `computeBreadcrumbs`: optional function for customizing breadcrumbs. It defaults to `defaultComputeBreadcrumbs` in the [Breadcrumbs](https://github.com/NYPL-Simplified/opds-web-client/blob/master/packages/opds-web-client/src/components/Breadcrumbs.tsx) module, and `hierarchyComputeBreacrumbs` is also available. It should return an array of link objects, each with `url` and `text` properties. Its accepts two arguments:
  - `collection`: object representing the current collection data (see `CollectionData` in the [interfaces file](https://github.com/NYPL-Simplified/opds-web-client/blob/master/packages/opds-web-client/src/interfaces.ts))
  - `history`: an array of link objects (each with `url` and `text` properties) that is appended every time the user navigates to a new collection
- `epubReaderUrlTemplate(epubUrl: string) => string`: optional function that returns a URL where you can read an EPUB file.
- `allLanguageSearch`: optional string to specify if searches in the catalog should not use the browser's language header in requests. Default: `false`

## React Component
The application is also available as a reusable React component:

```jsx
import OPDSCatalog from "opds-web-client";

ReactDOM.render(
  <OPDSCatalog
    collectionUrl={this.props.collectionUrl}
    bookUrl={this.props.bookUrl}
    pageTitleTemplate={this.pageTitleTemplate}
    BookDetailsContainer={BookDetailsContainer}
    Header={Header}
    />
);
```

For an example of the application in use as a React component, see [NYPL-Simplified/circulation-web](https://github.com/NYPL-Simplified/circulation-web).

### React Component Props

- `collectionUrl`: optional URL of an OPDS Acquisition or Navigation feed to load. Default: `null`
- `bookUrl`: optional URL of an OPDS Entry to load. Default: `null`
- `pageTitleTemplate(collectionTitle: string, bookTitle: string) => string`: optional function that accepts a collection and book title and returns an HTML page title. Default: `undefined`
- `Header`: optional custom React component class to render in place of the client's default header. This `Header` will receive three props, `collectionTitle`, `bookTitle`, and a `CatalogLink` which should be used for links to collections or books that the client should load, and one child, a `Search` component that will only be present when the loaded collection links to an Open Search Description document. Default: `undefined`
- `BookDetailsContainer`: optional custom React component class to render in place of the client's default `BookDetails` component. This `BookDetailsContainer` will receive three props: the current `collectionUrl` and `bookUrl`, and `refreshCatalog`, a function that can be called to refresh the collection and/or book. `BookDetailsContainer` will also receive the default rendered `BookDetails` component as a child. Default: `undefined`
- `authPlugins`: same as in "Standalone Config Options" above
- `computeBreadcrumbs`: same as in "Standalone Config Options" above
- `epubReaderUrlTemplate`: same as in "Standalone Config Options" above

### React Component Context

The OPDSCatalog React component should be rendered within a [React context](https://facebook.github.io/react/docs/context.html) that includes two items:

- `router`: any object that implements the `push`, `createHref`, and `isActive` methods of react-router's [context.router](https://reacttraining.com/react-router/core/api/contextrouter)
- `pathFor(collectionUrl: string, bookUrl: string) => string`: a function that accepts a collection URL and book URL and returns a string that will become the web browser's relative URL upon navigating to a new collection or book

## Accessibility

In order to develop user interfaces that are accessible to everyone, there are tools added to the workflow. Besides the Typescript `tslint-react-a11y` plugin (in `/packages/opds-web-client/tslint.json`), `react-axe` is also installed for local development. Using that module while running the app uses a lot of resources so it should be only when specifically testing for accessibility and not while actively developing new features or fixing bugs.

In order to run the app with `react-axe`, run `npm run dev-test-axe`. This will add a local global variable `process.env.TEST_AXE` (through webpack) that will trigger `react-axe` in `/packages/opds-web-client/src/app.tsx`. The output will be seen in the _browser's_ console terminal.

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

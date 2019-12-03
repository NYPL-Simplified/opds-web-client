## Changelog

### v0.3.2

- Pass the redux store down the tree via context
- Extracted PathForContext from the Root, which provides context via both legacy and new context APIs
- Created a RouterContext component which can be used by any application to pass a `router` context down the tree. See `circulation-patron-web` as an example.

### v0.3.1

- added "prettier" code formatter and a git hook to run prettier before each commit
- Updated tslint config to include prettier so that formatting is no longer a lint concern
- ran prettier on all files, so many small file changes.

### v0.3.0

- Updated to Typescript v3, ts-loader to v6, tslint to v5, and other @types packages.
- Fixed accessibility issues that `react-axe` picked up. This update therefore includes an update to the `$blue` scss variable color, `role` attribute fixes, and adding missing `label`s.

### v0.2.10

- Added `react-axe` to test for accessibility.

### v0.2.9

- Fixed function binding issue that caused a TypeError when resizing the window.
- Added error handler in DataFetcher if an adapter is not configured.

### v0.2.8

- Added Typedoc for code documentation of React components and related classes and functions.

### v0.2.7

- Added `tslint-react-a11y` to check for accessibility issues in the React components.

### v0.2.6

- Update the opds-feed-parser to version 0.0.17.

### v0.2.5

- Updated the app to use Redux 4.

### v0.2.4

- Updating the headings on the Book Details page.

### v0.2.3

- Added subtitle to the book details page and changed publication date to use UTC so it displays correctly when only date is specified.

### v0.2.2

- Updating the app to work with React 16.

### v0.2.1

- Minor update to redux and syntax in actions and reducers. Added more tests.

### v0.2.0

- Updated many packages include Typescript to 2.7.2 and Webpack to version 4. The update to Webpack 4 includes updates to loaders and plugins.
- Removed `typings` in favor of `@types` that goes along with the updated Typescript version.
- Typescript syntax and unit tests were updated and we are now using `fetch-mock` for mocking fetch requests.

### v0.1.27

- Updated the focus color for all elements.

### v0.1.26

- Modified search url to include `language=all` to search all languages instead of using the Accept-Language header from the browser. This is an optional prop that needs to be passed down as a prop at the top `OPDSCatalog` component level. The default is `false` which means it's okay to use the browser's Accept-Language header value.

### v0.1.25

- Modified the AuthProviderSelectionForm to pass a click handler to auth button components instead of putting it on a parent element.

### v0.1.24

- Removed hard-coded colors and moved lightening/darkening to overwritable variables for compatibility with additional color schemes and CSS variables.

### v0.1.23

- Updated the route handler component for the OPDSWebClient component in order to remove the `create-react-class` dependency.

### v0.1.22

#### Added

- Added "By" before an author(s) name.

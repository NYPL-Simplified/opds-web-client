## Changelog

### v0.6.3

- Removed console.logs and other comments from previous version following successful testing.
### v0.6.3-test

- The resolve function in OPDSDataAdapter is causing bugs in the List Manager of CM Admin. This version removes the function in order to test it.
### v0.6.2

- Updated class `.collection .collection-container` to give more space to the bottom.

### v0.6.1

- Updated npm packages to fix security issues.
### v0.6.0

- Updated npm packages to fix security issues.
### v0.5.7

- Add a button labeled "LCP License" to the UI and allow patrons to download LCP licenses as .lcpl files.

### v0.5.6

- Fix the `fetchBlob` script to retry on failure if the failure is after a redirect. This is because Amazon S3 will fail if we send it out `Authorization` header.

## v0.5.5

- Various type fixes to allow typescript strict mode in circulation-patron-web.

### v0.5.4

- Add optional AuthLink to AuthMethod type to support authentication and logo links

### v0.5.3

- Add: BookData interface now has optional allBorrowLinks prop

### v0.5.2

- Patch: Add redux devtools extension compatibility.
- Fix: Show "Read Online" label for atom media types.

### v0.5.1

- Fix: Use `new URL()` instead of `url.resolve` when parsing OPDS links. `resolve` is legacy and was causing bugs when on `https` but trying to resolve a link with a nested `http` segment.

### v0.5.0

- Add: SAML Auth support.

### v0.4.7

- Display "Read online" instead of "Download..." in download buttons for AxisNow media type

### v0.4.6

- Add AxisNow media type

### v0.4.5

- Send empty `Authentication` header when no credentials are present to prevent sending of cached credentials.
- Add overdrive media type

### v0.4.4

- add `isStreaming` flag to returned object from `useDownloadButton`.

### v0.4.3

- add `BookAvailability` enum type and use it to tighten `BookData` interface.

### v0.4.2

- Update `typeMap` and `MediaType` to add audiobook support.

### v0.4.1

- Removes the unused `isActive` property from the `router` context.

### v0.4.0

- Extracts the `getMedium` and `getMediumSVG` methods previously on the `Book` component into external functions so they can be imported and used in `circulation-patron-web`.

### v0.3.7

- Updates to new `jsdom` api in our use of it for server rendering.

### v0.3.6

- Extracts the logic that was previously in `DownloadButton` into `useDownloadButton` so it can be imported and used by circulation-patron-web.
- Adds the new `MediaType`, `MediaLink` and `FulfillmentLink` interfaces with stricter typing.
- Adds the streaming media and `application/atom+xml` types to the possible `MediaType`s received from the server.
- Adds the `fetcher` to the context passed down by `ActionsContext`. This is because it is occasionally necessary to access and use directly.
- Updates the `jsdom`, `react`, `react-dom`, `mocha`, and `react-test-renderer` deps to latest versions. This required updating node to the latest stable release 13.11.0.
- Fixes outdated test syntaxes caused by dep updates.
- Allow store to be passed in to `StoreContext` so that it can be mocked in testing

### v0.3.5

- Enables typescript `strictNullChecks`, which means that types cannot be `null` or `undefined` unless explicitly defined as such.
- Changes many types to allow for this, attempting to maintain the original functionality when running into errors.
- Adds kepub file type support via both typings and the typeMap.
- Extracts some utilities from `Root` and `Book` and `BookDetails` from class methods to plain functions so they can be imported and used elsewhere.

### v0.3.4

- Converted `Breadcrumbs.tsx` into a functional component.
- Created custom hooks for to use with redux: `useTypedSelector`, `useThunkDispatch`, and `useActions`.
- Refactored `DownloadButton.tsx` to use the hooks to call actions instead of having the `fulfillbook` and `indirectFulfillBook` functions be passed down as props from the root application component.

### v0.3.3

- Created a hook called `usePathFor` to consume `PathFor` context.
- Etracted `DownloadButton` logic for use in circulation-patron-web.
- Made many properties optional because they were already effectively optional, only this
  repo didn't have `strictNullChecks` turned on, while circulation-patron-web now does.
- Made `OpenAccessLinksType` string literal type for better checking and autofill.

### v0.3.2

- Pass the redux store down the tree via context.
- Extracted PathForContext from the Root, which provides context via both legacy and new context APIs.
- Created a RouterContext component which can be used by any application to pass a `router` context down the tree. See `circulation-patron-web` as an example.

### v0.3.1

- Added "prettier" code formatter and a git hook to run prettier before each commit.
- Updated tslint config to include prettier so that formatting is no longer a lint concern.
- Ran prettier on all files, so many small file changes.

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

## Changelog

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

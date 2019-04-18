import * as React from "react";
import { FacetGroupData } from "../interfaces";
export interface FacetGroupProps {
    facetGroup: FacetGroupData;
}
/** Renders a single facet group in the left sidebar of a collection, such as
    options for sorting or filtering. */
export default class FacetGroup extends React.Component<FacetGroupProps, {}> {
    render(): JSX.Element;
}

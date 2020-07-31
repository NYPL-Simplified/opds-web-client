import * as React from "react";
import { LaneData } from "../interfaces";
export interface LaneMoreLinkProps {
    lane: LaneData;
}
/** The link at the far right of a lane that goes to the full feed for that lane. */
export default class LaneMoreLink extends React.Component<LaneMoreLinkProps, {}> {
    render(): JSX.Element;
    computeFontSize(): string;
}

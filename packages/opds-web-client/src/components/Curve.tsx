import * as React from "react";
import CurveModel from "../models/Curve";

export interface CurveProps {
  points: any[];
  color?: string;
  thickness?: number;
}

export default class Curve extends React.Component<CurveProps, any> {
  constructor(props) {
    super(props);
    this.state = { paths: [] };
  }

  render() {
    return (
      <g>
        <path
          d={this.singlePathDescription()}
          stroke={`url(#curvePattern) ${this.props.color || "white"}`}
          strokeWidth={this.props.thickness || 5}
          strokeLinecap="round"
          fill="transparent" />
      </g>
    );
  }

  componentWillMount() {
    this.generatePathsFromPoints(this.props.points);
  }

  componentWillReceiveProps(nextProps) {
    this.generatePathsFromPoints(nextProps.points);
  }

  generatePathsFromPoints(points) {
    let curve = new CurveModel(points);
    let paths = curve.generatePaths();
    this.setState({ paths });
  }

  singlePathDescription() {
    if (this.state.paths.length === 0) {
      return "";
    }

    let paths = this.state.paths.concat([]);
    let first = paths.shift();
    let desc = `M ${first[0].join(" ")} Q ${first[1].join(" ")} ${first[2].join(" ")}`;

    let next;
    while (paths.length > 0) {
      next = paths.shift();
      desc += ` Q ${next[1].join(" ")} ${next[2].join(" ")}`;
    }

    return desc;
  }
}
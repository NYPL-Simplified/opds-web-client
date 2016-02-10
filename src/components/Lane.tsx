import * as React from "react";
import LaneBook from "./LaneBook";
import CollectionLink from "./CollectionLink";

export default class Lane extends React.Component<LaneProps, any> {
  render(): JSX.Element {
    let laneBooksStyle = {
      height: "260px",
      width: "100%",
      whiteSpace: "nowrap",
      overflowX: "scroll",
      overflowY: "hidden"
    };

    return (
      <div className="lane">
        <h2 style={{ clear: "both", paddingTop: "20px", cursor: "pointer" }}>
          <CollectionLink
            className="laneTitle"
            text={this.props.title}
            url={this.props.url}
            fetchCollection={this.props.fetchCollection} />
        </h2>

        <div className="laneBooks" style={laneBooksStyle}>
          { this.props.books && this.props.books.map(book =>
            <LaneBook key={book.id} {...book} />
          ) }
        </div>
      </div>
    );
  }
}
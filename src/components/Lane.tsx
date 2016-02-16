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
            text={this.props.lane.title}
            url={this.props.lane.url}
            setCollection={this.props.setCollection} />
        </h2>

        <div className="laneBooks" style={laneBooksStyle}>
          { this.props.lane.books && this.props.lane.books.map(book =>
            <LaneBook
              key={book.id}
              book={book}
              collectionUrl={this.props.collectionUrl}
              setBook={this.props.setBook} />
          ) }
        </div>
      </div>
    );
  }
}
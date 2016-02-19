import * as React from "react";
import LaneBook from "./LaneBook";
import CollectionLink from "./CollectionLink";

export default class Lane extends React.Component<LaneProps, any> {
  render(): JSX.Element {
    let laneBooksStyle = {
      display: "block",
      height: "260px",
      width: "100%",
      whiteSpace: "nowrap",
      overflowX: "scroll",
      overflowY: "hidden",
      padding: 0,
      margin: 0,
      listStyleType: "none"
    };

    return (
      <li className="lane">
        <h2 style={{ clear: "both", paddingTop: "20px", cursor: "pointer" }}>
          <CollectionLink
            className="laneTitle"
            text={this.props.lane.title}
            url={this.props.lane.url}
            setCollection={this.props.setCollection} />
        </h2>

        { this.props.lane.books &&
          <ul className="laneBooks" aria-label={"books in " + this.props.lane.title} style={laneBooksStyle}>
          { this.props.lane.books.map(book =>
            <LaneBook
              key={book.id}
              book={book}
              collectionUrl={this.props.collectionUrl}
              setBook={this.props.setBook} />
          ) }
          </ul>
        }
      </li>
    );
  }
}
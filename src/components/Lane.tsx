import * as React from "react";
import LaneBook from "./LaneBook";

export default class Lane extends React.Component<LaneProps, any> {  
  constructor(props: any) {
    super(props);
  }

  render() : JSX.Element {
    return (
      <div className="lane">
        <h2 style={{ clear: "both", paddingTop: "20px" }}>{this.props.title}</h2>

        <div className="laneBooks" style={{ height: "260px", width: "100%", whiteSpace: "nowrap", overflowX: "scroll", overflowY: "hidden" }}>
          { this.props.books && this.props.books.map(book => 
            <LaneBook key={book.id} {...book} />
          ) }
        </div>
      </div>
    )
  }
}
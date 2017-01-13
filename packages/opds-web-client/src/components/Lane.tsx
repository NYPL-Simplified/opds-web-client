import * as React from "react";
import Book from "./Book";
import CatalogLink from "./CatalogLink";
import LaneMoreLink from "./LaneMoreLink";
import { LaneData, BookData } from "../interfaces";

export interface LaneProps {
  lane: LaneData;
  collectionUrl?: string;
  hideMoreLink?: boolean;
  hiddenBookIds?: string[];
}

export default class Lane extends React.Component<LaneProps, any> {
  constructor(props) {
    super(props);
    this.state = { marginLeft: 0, atLeft: true, atRight: false };
    this.scrollBack = this.scrollBack.bind(this);
    this.scrollForward = this.scrollForward.bind(this);
  }

  render(): JSX.Element {
    let visibleBooks = this.visibleBooks();

    if (visibleBooks.length === 0) {
      return null;
    }

    return (
      <div className="lane">
        <h2>
          <CatalogLink
            className="title"
            collectionUrl={this.props.lane.url}>
            {this.props.lane.title}
          </CatalogLink>
        </h2>

        <div ref="container" className="lane-books-container">
          { !this.state.atLeft &&
            <div className="scroll-button left" role="presentation" onClick={this.scrollBack}>
              &lt;
            </div>
          }
          { !this.state.atRight &&
            <div className="scroll-button right" role="presentation" onClick={this.scrollForward}>
              &gt;
            </div>
          }
          <ul
            ref="list"
            className="lane-books"
            aria-label={"books in " + this.props.lane.title}
            style={{ marginLeft: this.state.marginLeft }}
            >
            { visibleBooks.map((book, index) =>
              <li key={index}>
                <Book
                  book={book}
                  collectionUrl={this.props.collectionUrl}
                  />
              </li>
            ) }
            { !this.props.hideMoreLink &&
              <li key="more">
                <LaneMoreLink lane={this.props.lane} />
              </li>
            }
          </ul>
        </div>
      </div>
    );
  }

  visibleBooks(): BookData[] {
    if (!this.props.hiddenBookIds) {
      return this.props.lane.books;
    }

    return this.props.lane.books.filter(book =>
      this.props.hiddenBookIds.indexOf(book.id) === -1
    );
  }

  getContainerWidth(): number {
    return (this.refs["container"] as any).clientWidth;
  }

  getScrollWidth(): number {
    return (this.refs["list"] as any).scrollWidth;
  }

  scrollBack() {
    let atLeft = false;
    let atRight = false;
    let containerWidth = this.getContainerWidth();
    let newMarginLeft = this.state.marginLeft + containerWidth - 20;
    if (newMarginLeft >= 0) {
      newMarginLeft = 0;
      atLeft = true;
    }
    this.setState({ marginLeft: newMarginLeft, atLeft, atRight });
  }

  scrollForward() {
    let atLeft = false;
    let atRight = false;
    let scrollWidth = this.getScrollWidth();
    let containerWidth = this.getContainerWidth();
    let minMarginLeft = containerWidth - scrollWidth;
    let newMarginLeft = this.state.marginLeft - containerWidth + 20;
    if (newMarginLeft <= minMarginLeft) {
      newMarginLeft = minMarginLeft;
      atRight = true;
    }
    this.setState({ marginLeft: newMarginLeft, atLeft, atRight });
  }

  componentDidMount() {
    let scrollWidth = this.getScrollWidth();
    let containerWidth = this.getContainerWidth();
    let minMarginLeft = containerWidth - scrollWidth;
    if (this.state.marginLeft === minMarginLeft) {
      this.setState({ atRight: true });
    }
  }
}
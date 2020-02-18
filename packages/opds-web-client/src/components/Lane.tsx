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
  isSignedIn?: boolean;
  updateBook: (url: string) => Promise<BookData>;
  epubReaderUrlTemplate?: (epubUrl: string) => string;
}

export interface LaneState {
  atLeft: boolean;
  atRight: boolean;
}

/** Shows one scrollable lane in a collection. */
export default class Lane extends React.Component<LaneProps, LaneState> {
  constructor(props) {
    super(props);
    this.state = { atLeft: true, atRight: false };
    this.scrollBack = this.scrollBack.bind(this);
    this.scrollForward = this.scrollForward.bind(this);
    this.updateScrollButtons = this.updateScrollButtons.bind(this);
  }

  render() {
    let visibleBooks = this.visibleBooks();

    if (visibleBooks.length === 0) {
      return null;
    }

    return (
      <div className="lane">
        <h2>
          <CatalogLink className="title" collectionUrl={this.props.lane.url}>
            {this.props.lane.title}
          </CatalogLink>
        </h2>

        <div ref="container" className="lane-books-container">
          {!this.state.atLeft && (
            <button
              className="scroll-button left"
              aria-label={"Scroll back in " + this.props.lane.title}
              onClick={this.scrollBack}
            >
              &#9665;
            </button>
          )}
          <ul
            ref="list"
            className="lane-books"
            aria-label={"books in " + this.props.lane.title}
          >
            {visibleBooks.map((book, index) => (
              <li key={index}>
                <Book
                  book={book}
                  collectionUrl={this.props.collectionUrl}
                  updateBook={this.props.updateBook}
                  isSignedIn={this.props.isSignedIn}
                  epubReaderUrlTemplate={this.props.epubReaderUrlTemplate}
                />
              </li>
            ))}
            {!this.props.hideMoreLink && (
              <li key="more">
                <LaneMoreLink lane={this.props.lane} />
              </li>
            )}
          </ul>
          {!this.state.atRight && (
            <button
              className="scroll-button right"
              aria-label={"Scroll forward in " + this.props.lane.title}
              onClick={this.scrollForward}
            >
              &#9655;
            </button>
          )}
        </div>
      </div>
    );
  }

  visibleBooks(): BookData[] {
    if (!this.props.hiddenBookIds) {
      return this.props.lane.books;
    }

    return this.props.lane.books.filter(
      // the following optional chaining will ensure it evaluates to false if
      // hiddenBookIds is undefined
      book => this.props.hiddenBookIds?.indexOf(book.id) === -1
    );
  }

  getContainerWidth(): number {
    return (this.refs["container"] as any).clientWidth;
  }

  getScrollWidth(): number {
    return (this.refs["list"] as any).scrollWidth;
  }

  getScroll(): number {
    return (this.refs["list"] as any).scrollLeft;
  }

  changeScroll(delta: number): void {
    let oldScroll = this.getScroll();
    let newScroll = oldScroll + delta;

    let scrollWidth = this.getScrollWidth();
    let containerWidth = this.getContainerWidth();
    if (newScroll > scrollWidth - containerWidth) {
      newScroll = scrollWidth - containerWidth;
    }
    if (newScroll < 0) {
      newScroll = 0;
    }

    let increment = 25;
    if (delta < 0) {
      increment = increment * -1;
    }

    let animationFrame;
    let incrementScroll = (time: number) => {
      let scroll = this.getScroll();
      let remainingScroll = newScroll - scroll;
      let list = this.refs["list"] as any;
      if (Math.abs(remainingScroll) < Math.abs(increment)) {
        list.scrollLeft = newScroll;
        window.cancelAnimationFrame(animationFrame);
      } else {
        list.scrollLeft = scroll + increment;
        animationFrame = window.requestAnimationFrame(incrementScroll);
      }
    };
    animationFrame = window.requestAnimationFrame(incrementScroll);
  }

  scrollBack() {
    let containerWidth = this.getContainerWidth();
    let delta = -containerWidth + 50;
    this.changeScroll(delta);
  }

  scrollForward() {
    let containerWidth = this.getContainerWidth();
    let delta = containerWidth - 50;
    this.changeScroll(delta);
  }

  updateScrollButtons() {
    let atLeft = false;
    let atRight = false;

    let scroll = this.getScroll();
    let scrollWidth = this.getScrollWidth();
    let containerWidth = this.getContainerWidth();
    if (scroll <= 0) {
      atLeft = true;
    }
    if (scroll >= scrollWidth - containerWidth) {
      atRight = true;
    }
    this.setState({ atLeft, atRight });
  }

  componentDidMount() {
    let list = this.refs["list"] as any;
    if (list) {
      list.addEventListener("scroll", this.updateScrollButtons);
      window.addEventListener("resize", this.updateScrollButtons);
      this.updateScrollButtons();
    }
  }

  componentWillUnmount() {
    let list = this.refs["list"] as any;
    if (list) {
      list.removeEventListener("scroll", this.updateScrollButtons);
      window.removeEventListener("resize", this.updateScrollButtons);
    }
  }
}

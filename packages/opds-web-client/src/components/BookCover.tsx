import * as React from "react";
import { BookData } from "../interfaces";
const seedrandom = require("seedrandom");

export interface BookCoverProps extends React.HTMLProps<BookCover> {
  book: BookData;
}

export interface BookCoverState {
  error: boolean;
}

/** Shows a cover image from the OPDS feed or an automatically generated cover for
    a single book. */
export default class BookCover extends React.Component<
  BookCoverProps,
  BookCoverState
> {
  constructor(props) {
    super(props);
    this.state = { error: false };
    this.handleError = this.handleError.bind(this);
  }

  handleError(event) {
    this.setState({ error: true });
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.error) {
      this.setState({ error: false });
    }
  }

  render() {
    let { title, authors, imageUrl } = this.props.book;
    if (imageUrl && !this.state.error) {
      return (
        <img
          src={imageUrl}
          onError={this.handleError}
          className="book-cover"
          role="presentation"
          alt=""
        />
      );
    }

    let titleFontSize = this.computeFontSize(title, 40);
    let authorFontSize = this.computeFontSize(authors?.join(", ") ?? "", 25);

    let hue = this.seededRandomHue(title);
    let bgColor = `hsla(${hue}, 40%, 60%, 1)`;

    return (
      <div className="auto-book-cover" style={{ backgroundColor: bgColor }}>
        <div className="title" style={{ fontSize: titleFontSize }}>
          {title}
        </div>
        {authors?.length && (
          <div className="authors" style={{ fontSize: authorFontSize }}>
            By {authors.join(", ")}
          </div>
        )}
      </div>
    );
  }

  computeFontSize(text: string, baseFontSize = 40, minFontSize = 15) {
    // decrease size as max word length increases
    // decrease size as word count grows beyond 3
    let words = text.split(/\s/);
    let wordCount = words.length;
    let maxLength = Math.max(...words.map(word => word.length));
    let fontSize = Math.max(
      minFontSize,
      baseFontSize - maxLength * 2 - Math.max(0, wordCount - 3) * 2
    );

    return fontSize / 13 + "em";
  }

  seededRandomHue(seed) {
    return Math.round(360 * seedrandom(seed)());
  }
}

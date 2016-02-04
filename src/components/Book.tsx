import * as React from 'react';

export default class Book extends React.Component<any, any> {  
  constructor(props: any) {
    super(props);
  }

  render() : JSX.Element {
    let bookStyle = {
      float: "left",
      textAlign: "center",
      marginRight: "10px",
      width: "350px",
      height: "200px",
      marginBottom: "10px",
      overflow: "hidden"
    };

    let bookCoverStyle = {
      width: "150px",
      height: "200px",
      float: "left"
    };

    let bookInfoStyle = {
      width: "160px",
      textAlign: "left",
      marginTop: "15px",
      marginLeft: "5px",
      float: "left"
    };

    return (
      <div className="book" style={ bookStyle }>
        <img src={this.props.imageUrl} style={ bookCoverStyle } />
        <div className="bookInfo" style={ bookInfoStyle }>
          <h3 className="bookTitle">{this.props.title}</h3>
          <h4 className="bookAuthors">{this.props.authors.join(", ")}</h4>
        </div>
      </div>
    );
  }
}
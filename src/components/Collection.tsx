import * as React from 'react';
import Book from './Book';
import Lane from './Lane';

export default class Collection extends React.Component<any, any> {  
  constructor(props: any) {
    super(props);
  }

  render() : JSX.Element {
    let collectionTopStyle = { 
      padding: "10px", 
      backgroundColor: "#eee", 
      borderBottom: "1px solid #ccc", 
      marginBottom: "10px",
      textAlign: "center"
    };
            
    return (
      <div className="collection" style={{ fontFamily: "Arial, sans-serif" }}>
        <div className="collectionTop" style={collectionTopStyle}>
          <h1 style={{ margin: 0 }}>{this.props.title}</h1>
        </div>

        { this.props.lanes && this.props.lanes.map(lane => 
            <Lane key={lane.title} {...lane} />
        ) } 

        { this.props.books && this.props.books.map(book =>
            <Book key={book.id} {...book} />
          ) }
      </div>
    );
  }
}
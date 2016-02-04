import * as React from 'react';
import Book from './Book';
import Lane from './Lane';

export default class Collection extends React.Component<CollectionProps, any> {  
  constructor(props: any) {
    super(props);
  }

  render() : JSX.Element {
    let collectionTopStyle = { 
      padding: "10px", 
      backgroundColor: "#eee", 
      borderBottom: "1px solid #ccc", 
      marginBottom: "10px",
      textAlign: "center",
      position: "fixed",
      width: "100%",
      height: "50px",
      top: "0"
    };
            
    return (
      <div className="collection" style={{ fontFamily: "Arial, sans-serif" }}>
        <div className="collectionTop" style={collectionTopStyle}>
          <h1 style={{ margin: 0 }}>{this.props.title}</h1>
        </div>

        <div className="collectionBody" style={{ paddingTop: "60px", height: "100%", margin: "15px"  }}>
          { this.props.lanes && this.props.lanes.map(lane => 
              <Lane key={lane.title} {...lane} />
          ) } 

          { this.props.books && this.props.books.map(book =>
              <Book key={book.id} {...book} />
          ) }
        </div>
      </div>
    );
  }
}
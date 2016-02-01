import * as React from 'react';
import Book from './Book';

export default class Lane extends React.Component<any, any> {  
  constructor(props: any) {
    super(props);
  }

  render() : JSX.Element {
    return (
      <div className="opdsLane">
        <h2>{this.props.title}</h2>

        { this.props.books.map(book => 
          <Book key={book.id} {...book} />
        ) }
      </div>
    )
  }
}
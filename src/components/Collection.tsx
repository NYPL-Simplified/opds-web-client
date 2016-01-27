import * as React from 'react';
import Entry from './Entry';

export default class Collection extends React.Component<CollectionProps, any> {  
  constructor(props: CollectionProps) {
    super(props);
  }

  render() : JSX.Element {
    return (
      <div className="opdsCollection">
        <h2>{this.props.title}</h2>

        { this.props.entries.map(entry => 
          <Entry key={entry.id} {...entry} />
        ) }
      </div>
    )
  }
}
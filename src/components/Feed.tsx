import * as React from 'react';
import Entry from './Entry';
import Collection from './Collection';
import * as Immutable from 'immutable';
import { keys } from 'lodash';

export default class Feed extends React.Component<FeedProps, any> {  
  constructor(props: FeedProps) {
    super(props);
  }

  render() : JSX.Element {
    let feedTopStyle = { 
      padding: "10px", 
      backgroundColor: "#eee", 
      borderBottom: "1px solid #ccc", 
      marginBottom: "10px",
      textAlign: "center"
    };
    
    let [entryCollections, otherEntries] = this.getEntryCollections(this.props.entries);
        
    return (
      <div className="opdsFeed" style={{ fontFamily: "Arial, sans-serif" }}>
        <div className="opdsFeedTop" style={feedTopStyle}>
          <h1 style={{ margin: 0 }}>{this.props.title}</h1>
        </div>

        { keys(entryCollections).map(title => 
            <Collection key={title} title={title} {...entryCollections[title]} />
        ) } 

        { otherEntries.map(entry =>
            <Entry key={entry.id} {...entry} />
          ) }
      </div>
    );
  }
  
  getEntryCollections(entries: EntryModel[] = []): [Object, EntryModel[]] {
    let entriesWithoutCollections: EntryModel[] = [];

    let entryCollections = entries.reduce((result, entry) => {
      if (entry.collection) {
        let { title, url } = entry.collection;
        
        if (result[title]) {
          result[title].entries.push(entry);
        } else {
          result[title] = { url, entries: [entry] };
        }
      } else {
        entriesWithoutCollections.push(entry);
      }
      
      return result;
    }, {});
       
    return [entryCollections, entriesWithoutCollections];
  }
}
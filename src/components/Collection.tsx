import * as React from "react";
import Book from "./Book";
import Link from "./Link";
import Lane from "./Lane";
import FacetGroup from "./FacetGroup";
import Search from "./Search";

export default class Collection extends React.Component<CollectionProps, any> {
  render(): JSX.Element {
    let padding = 10;
    let headerHeight = 50;
    let leftPanelWidth = 190;

    let collectionTopStyle = {
      padding: `${padding}px`,
      backgroundColor: "#eee",
      borderBottom: "1px solid #ccc",
      marginBottom: `${padding}px`,
      textAlign: "center",
      position: "fixed",
      width: "100%",
      height: `${headerHeight}px`,
      top: "0"
    };

    let collectionBodyStyle: any = {
      padding: `${padding}px`,
      paddingTop: `${headerHeight + padding}px`,
      height: "100%",
      marginTop: `${padding + 5}px`
    };

    if (this.props.facetGroups && this.props.facetGroups.length) {
      collectionBodyStyle.marginLeft = `${leftPanelWidth + padding}px`;
    }

    let leftPanelStyle = {
      paddingTop: `${headerHeight + padding}px`,
      width: `${leftPanelWidth}px`,
      position: "fixed",
      left: "0"
    };

    return (
      <div className="collection" style={{ fontFamily: "Arial, sans-serif" }}>
        <div className="collectionTop" style={collectionTopStyle}>
          <h1 style={{ margin: 0 }}>{this.props.title}</h1>
          { this.props.search &&
            <Search
              {...this.props.search}
              fetchSearchDescription={this.props.fetchSearchDescription}
              fetchCollection={this.props.fetchCollection} />
          }
        </div>

        {this.props.facetGroups && this.props.facetGroups.length && (
          <div className="facetGroups" style={leftPanelStyle}>
            { this.props.facetGroups.map(facetGroup =>
                <FacetGroup key={facetGroup.label} {...facetGroup} fetchCollection={this.props.fetchCollection} />
            )}
          </div>
        )}

        <div className="collectionBody" style={collectionBodyStyle}>

          { this.props.lanes && this.props.lanes.map(lane =>
              <Lane key={lane.title} {...lane} fetchCollection={this.props.fetchCollection} />
          ) }

          { this.props.books && this.props.books.map(book =>
              <Book key={book.id} {...book} />
          ) }

          { this.props.links && this.props.links.map(link =>
              <Link key={link.id} {...link} fetchCollection={this.props.fetchCollection} />
          )}
        </div>
      </div>
    );
  }
}
import * as React from 'react';

export default class Link extends React.Component<LinkProps, any> {
  render(): JSX.Element {
    let linkStyle = {
      textAlign: "center",
      backgroundColor: "#ddd",
      margin: "25px",
      padding: "10px",
      overflow: "hidden",
      fontSize: '500%'
    };

    return (
      <div className="link" style={ linkStyle }>
        <a href="#" onClick={() => this.props.fetchUrl(this.props.href)}>
          {this.props.title}
        </a>
      </div>
    );
  }
}
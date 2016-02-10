import * as React from "react";

export default class LoadingIndicator extends React.Component<any, any> {
  render(): JSX.Element {
    let loadingWidth = 200;
    let loadingStyle = {
      position: "fixed",
      top: "50%",
      left: "50%",
      width: `${loadingWidth}px`,
      marginTop: "-100px",
      marginLeft: `-${loadingWidth / 2}px`,
      padding: "30px",
      backgroundColor: "#bbb",
      textAlign: "center",
      fontFamily: "Arial, Helvetica, sans-serif"
    };

    return (
      <h1 className="loading" style={loadingStyle}>LOADING</h1>
    );
  }
}
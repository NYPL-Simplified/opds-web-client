import * as React from "react";

export default class Modal extends React.Component<any, any> {
  render(): JSX.Element {
    let modalStyle = {
      width: "80%",
      height: "80%",
      position: "fixed",
      left: "10%",
      top: "10%",
      padding: "30px",
      boxSizing: "border-box",
      backgroundColor: "#fff",
      fontFamily: "Arial, Helvetica, sans-serif",
      zIndex: 20
    };

    let screenStyle = {
      position: "fixed",
      zIndex: 10,
      top: "0",
      bottom: "0",
      width: "100%",
      backgroundColor: "rgba(128, 128, 128, 0.8)"
    };

    return (
      <div>
        <div
          className="modalScreen"
          onClick={this.props.close}
          style={screenStyle}></div>
        <div className="modalContent" style={modalStyle}>
          <div style={{ float: "right" }}>
            <a href="javascript:void(0)"
              className="modalCloseLink"
              style={{ fontSize: "1em" }}
              onClick={this.props.close}>
              Close
            </a>
          </div>
          {this.props.children}
        </div>
      </div>
    );

  }
}
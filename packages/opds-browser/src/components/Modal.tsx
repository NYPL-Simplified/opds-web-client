import * as React from "react";
import * as ReactDOM from "react-dom";

export default class Modal extends React.Component<any, any> {
  render(): JSX.Element {
    let modalStyle = {
      width: "60%",
      position: "fixed",
      left: "20%",
      padding: "30px",
      backgroundColor: "#fff",
      fontFamily: "Arial, Helvetica, sans-serif",
      zIndex: 20,
      borderRadius: "10px",
      overflowY: "auto"
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

  componentDidMount() {
    this.setPosition();
    this.setCollectionOverflow("hidden");
  }

  componentWillUnmount() {
    this.setCollectionOverflow("visible");
  }

  setPosition() {
    let node = ReactDOM.findDOMNode(this).querySelector(".modalContent") as HTMLElement;
    let newHeight = Math.min(node.offsetHeight, window.innerHeight - 200);
    node.style.height = newHeight + "px";
    node.style.top = (window.innerHeight - node.offsetHeight) / 2 + "px";
  }

  setCollectionOverflow(value: string) {
    let elem = document.getElementsByTagName("body")[0] as HTMLElement;

    if (elem) {
      elem.style.overflow = value;
    }
  }
}
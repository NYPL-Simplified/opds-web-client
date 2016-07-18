import * as React from "react";
import { popupStyle } from "./styles";
import { BasicAuthCallback } from "../interfaces";

export interface BasicAuthFormProps {
  saveCredentials: (credentials: string) => void;
  hide: () => void;
  callback: BasicAuthCallback;
  title?: string;
  loginLabel?: string;
  passwordLabel?: string;
}

export default class BasicAuthForm extends React.Component<BasicAuthFormProps, any> {
  constructor(props) {
    super(props);
    this.submit = this.submit.bind(this);
  }

  render() {
    let authFormStyle = popupStyle(300);

    return (
      <div className="authForm" style={authFormStyle}>
        <h3 style={{ marginTop: "0px" }}>{ this.props.title + " " || ""}Login</h3>
        <form onSubmit={this.submit}>
          <input
            className="form-control"
            ref="username"
            type="text"
            placeholder={this.props.loginLabel || "username"}
            />
          <br />
          <input
            className="form-control"
            ref="password"
            type="password"
            placeholder={this.props.passwordLabel || "password"}
            />
          <br />
          <input type="submit" className="btn btn-default" value="Submit" />
          &nbsp;&nbsp;
          <button className="btn btn-default" onClick={this.props.hide}>Cancel</button>
        </form>
      </div>
    )
  }

  submit(event) {
    event.preventDefault();

    let username = (this.refs["username"] as any).value;
    let password = (this.refs["password"] as any).value;
    let credentials = btoa(username + ":" + password);

    this.props.saveCredentials(credentials);
    this.props.hide();

    if (this.props.callback) {
      this.props.callback(credentials);
    }
  }
}
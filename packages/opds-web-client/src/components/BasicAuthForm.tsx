import * as React from "react";
import { popupStyle } from "./styles";
import { BasicAuthCallback } from "../interfaces";

export interface BasicAuthFormProps {
  hide: () => void;
  saveCredentials: (credentials: string) => void;
  callback?: BasicAuthCallback;
  title?: string;
  loginLabel?: string;
  passwordLabel?: string;
  error?: string;
}

export default class BasicAuthForm extends React.Component<BasicAuthFormProps, any> {
  constructor(props) {
    super(props);
    this.state = { error: this.props.error };
    this.submit = this.submit.bind(this);
    this.cancel = this.cancel.bind(this);
  }

  render() {
    let authFormStyle = popupStyle(300, 300);

    return (
      <div className="authForm" style={authFormStyle}>
        <h3 style={{ marginTop: "0px", marginBottom: "20px" }}>{ this.props.title + " " || ""}Login</h3>
        { this.state.error &&
          <div className="authFormError" style={{ padding: "0.5em", color: "#f00" }}>
            { this.state.error }
          </div>
        }
        <form onSubmit={this.submit}>
          <input
            className="form-control"
            ref="login"
            type="text"
            placeholder={this.loginLabel()}
            />
          <br />
          <input
            className="form-control"
            ref="password"
            type="password"
            placeholder={this.passwordLabel()}
            />
          <br />
          <input type="submit" className="btn btn-default" value="Submit" />
          &nbsp;&nbsp;
          <button className="btn btn-default" onClick={this.cancel}>Cancel</button>
        </form>
      </div>
    );
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ error: nextProps.error });
  }

  loginLabel() {
    return this.props.loginLabel || "username";
  }

  passwordLabel() {
    return this.props.passwordLabel || "password";
  }

  validate() {
    let login = (this.refs["login"] as any).value;
    let password = (this.refs["password"] as any).value;

    if (!login || !password) {
      this.setState({
        error: `${this.loginLabel()} and ${this.passwordLabel()} are required`
      });
      return false;
    } else {
      this.setState({ error: null});
    }

    return true;
  }

  submit(event) {
    event.preventDefault();

    if (this.validate()) {
      let login = (this.refs["login"] as any).value;
      let password = (this.refs["password"] as any).value;
      let credentials = this.generateCredentials(login, password);

      this.props.saveCredentials(credentials);
      this.props.hide();

      if (this.props.callback) {
        this.props.callback(credentials);
      }
    }
  }

  cancel() {
    this.props.hide();

    // only go back when auth form was triggered by another action
    if (this.props.callback) {
      window.history.back();
    }
  }

  generateCredentials(login, password) {
    return btoa(login + ":" + password);
  }
}
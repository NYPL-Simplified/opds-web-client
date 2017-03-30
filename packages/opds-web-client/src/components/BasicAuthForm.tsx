import * as React from "react";
import { AuthCallback, AuthProvider, BasicAuthMethod } from "../interfaces";
import { AuthFormProps } from "./AuthProviderSelectionForm";

export interface BasicAuthFormProps extends AuthFormProps<BasicAuthMethod> {}
export interface BasicAuthFormState {
  error: string;
}

export default class BasicAuthForm extends React.Component<BasicAuthFormProps, BasicAuthFormState> {
  constructor(props) {
    super(props);
    this.state = { error: this.props.error };
    this.submit = this.submit.bind(this);
  }

  render() {
    return (
      <form onSubmit={this.submit}>
        { this.state.error &&
          <div className="auth-error">
            { this.state.error }
          </div>
        }
        <input
          className="form-control"
          ref="login"
          type="text"
          autoFocus
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
        { this.props.cancel &&
          <input type="reset" className="btn btn-default" onClick={this.props.cancel} value="Cancel" />
        }
      </form>
    );
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ error: nextProps.error });
  }

  loginLabel() {
    return this.props.provider.method.labels.login || "username";
  }

  passwordLabel() {
    return this.props.provider.method.labels.password || "password";
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

      this.props.saveCredentials({
        provider: this.props.provider.name,
        credentials: credentials
      });
      this.props.hide();

      if (this.props.callback) {
        this.props.callback();
      }
    }
  }

  generateCredentials(login, password) {
    return "Basic " + btoa(login + ":" + password);
  }
}
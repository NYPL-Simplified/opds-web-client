import * as React from "react";
import { BasicAuthMethod } from "../interfaces";
import { AuthFormProps } from "./AuthProviderSelectionForm";

export interface BasicAuthFormProps extends AuthFormProps<BasicAuthMethod> {}
export interface BasicAuthFormState {
  error: string;
}

/** Form for logging in with basic auth. */
export default class BasicAuthForm extends React.Component<BasicAuthFormProps, BasicAuthFormState> {
  private loginRef = React.createRef<HTMLInputElement>();
  private passwordRef = React.createRef<HTMLInputElement>();

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
        <label htmlFor="login-input">{this.loginLabel()}</label>
        <input
          id="login-input"
          className="form-control"
          ref={this.loginRef}
          type="text"
          autoFocus
          />
        <br />
        <label htmlFor="password-input">{this.passwordLabel()}</label>
        <input
          id="password-input"
          className="form-control"
          ref={this.passwordRef}
          type="password"
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

  /**
   * validate()
   * Not all libraries require a password to log in so that value is not checked.
   */
  validate() {
    const login = this.loginRef.current && this.loginRef.current.value;
    if (!login) {
      this.setState({
        error: `${this.loginLabel()} is required`
      });
      return false;
    } else {
      this.setState({ error: null });
    }

    return true;
  }

  submit(event) {
    event.preventDefault();

    if (this.validate()) {
      const login = this.loginRef.current && this.loginRef.current.value;
      const password = this.passwordRef.current && this.passwordRef.current.value;
      let credentials = this.generateCredentials(login, password);

      this.props.saveCredentials({
        provider: this.props.provider.id,
        credentials: credentials
      });
      this.props.hide();

      if (this.props.callback) {
        this.props.callback();
      }
    }
  }

  generateCredentials(login, password) {
    const btoaStr = btoa(`${login}:${password}`);
    return `Basic ${btoaStr}`;
  }
}

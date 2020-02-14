import * as React from "react";
import { BasicAuthMethod } from "../interfaces";
import { AuthFormProps } from "./AuthProviderSelectionForm";
import { generateCredentials } from "../utils/auth";

export interface BasicAuthFormProps extends AuthFormProps<BasicAuthMethod> {}
export interface BasicAuthFormState {
  error?: string | null;
}

/** Form for logging in with basic auth. */
export default class BasicAuthForm extends React.Component<
  BasicAuthFormProps,
  BasicAuthFormState
> {
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
        {this.state.error && (
          <div className="auth-error">{this.state.error}</div>
        )}
        <input
          aria-label={`Input for ${this.loginLabel()}`}
          className="form-control"
          ref={this.loginRef}
          type="text"
          autoFocus
          placeholder={this.loginLabel()}
        />
        <br />
        <input
          aria-label={`Input for ${this.passwordLabel()}`}
          className="form-control"
          ref={this.passwordRef}
          type="password"
          placeholder={this.passwordLabel()}
        />
        <br />
        <input type="submit" className="btn btn-default" value="Submit" />
        {this.props.cancel && (
          <input
            type="reset"
            className="btn btn-default"
            onClick={this.props.cancel}
            value="Cancel"
          />
        )}
      </form>
    );
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ error: nextProps.error });
  }

  loginLabel() {
    return this.props.provider?.method.labels.login || "username";
  }

  passwordLabel() {
    return this.props.provider?.method.labels.password || "password";
  }

  /**
   * validate()
   * Not all libraries require a password to log in so that value is not checked.
   */
  validate(login: string | null | undefined): login is string {
    // const login = this.loginRef.current && this.loginRef.current.value;
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

    if (this.validate(this.loginRef.current?.value)) {
      const login = this.loginRef.current && this.loginRef.current.value;
      const password =
        this.passwordRef.current && this.passwordRef.current.value;
      let credentials = generateCredentials(login, password ?? "");

      this.props.saveCredentials?.({
        provider: this.props.provider?.id,
        credentials: credentials
      });
      this.props.hide?.();

      if (this.props.callback) {
        this.props.callback();
      }
    }
  }
}

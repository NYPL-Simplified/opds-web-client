import * as React from "react";
import { AuthCallback, AuthCredentials, AuthProvider } from "../interfaces";

export interface AuthFormProps {
  hide?: () => void;
  saveCredentials?: (credentials: AuthCredentials) => void;
  callback?: AuthCallback;
  error?: string;
  provider?: AuthProvider;
}

export interface AuthButtonProps {
  provider?: AuthProvider;
}

export interface AuthProviderSelectionFormProps {
  hide: () => void;
  saveCredentials: (credentials: AuthCredentials) => void;
  callback?: AuthCallback;
  cancel: () => void;
  title?: string;
  error?: string;
  providers?: AuthProvider[];
}

export default class AuthProviderSelectionForm extends React.Component<AuthProviderSelectionFormProps, any> {
  constructor(props) {
    super(props);
    this.state = { selectedProvider: null };
    this.selectProvider = this.selectProvider.bind(this);
  }

  render() {
    let AuthForm = this.state.selectedProvider && this.state.selectedProvider.plugin.formComponent;

    return (
      <div className="auth-form">
        <h3>{ this.props.title + " " || ""}Login</h3>
        { this.state.selectedProvider &&
          <AuthForm
            hide={this.props.hide}
            saveCredentials={this.props.saveCredentials}
            callback={this.props.callback}
            error={this.props.error}
            provider={this.state.selectedProvider}
          />
        }
        { !this.state.selectedProvider && this.props.providers && this.props.providers.length > 0 &&
          <ul className="subtle-list" aria-label="authentication options">
            { this.props.providers.map(provider =>
              <li onClick={() => this.selectProvider(provider)} key={provider.name}>
                <provider.plugin.buttonComponent provider={provider}/>
              </li>
            ) }
          </ul>
        }
        <button className="btn btn-default" onClick={this.props.cancel}>Cancel</button>
      </div>
    );
  }

  componentWillMount() {
    if (this.props.providers && this.props.providers.length === 1) {
      this.setState({ selectedProvider: this.props.providers[0] });
    }
  }

  selectProvider(provider) {
    this.setState({ selectedProvider: provider });
  }
}
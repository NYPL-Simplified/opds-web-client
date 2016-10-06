import { AuthFormProps, AuthButtonProps } from "./components/AuthProviderSelectionForm";
import { AuthMethod } from "./interfaces";

interface AuthPlugin {
  type: string;
  lookForCredentials: () => string | void;
  formComponent: new(props: AuthFormProps<AuthMethod>) => __React.Component<AuthFormProps<AuthMethod>, any>;
  buttonComponent: new(props: AuthButtonProps<AuthMethod>) => __React.Component<AuthButtonProps<AuthMethod>, any>;
}

export default AuthPlugin;
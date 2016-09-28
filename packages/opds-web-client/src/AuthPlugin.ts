import { AuthFormProps, AuthButtonProps } from "./components/AuthProviderSelectionForm";

interface AuthPlugin {
  type: string;
  lookForCredentials: () => void;
  formComponent: new(props: AuthFormProps) => __React.Component<AuthFormProps, any>;
  buttonComponent: new(props: AuthButtonProps) => __React.Component<AuthButtonProps, any>;
}

export default AuthPlugin;
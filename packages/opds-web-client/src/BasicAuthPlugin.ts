import AuthPlugin from "./AuthPlugin";
import BasicAuthForm from "./components/BasicAuthForm";
import BasicAuthButton from "./components/BasicAuthButton";

const BasicAuthPlugin: AuthPlugin = {
  type: "http://opds-spec.org/auth/basic",

  lookForCredentials: () => {},

  formComponent: BasicAuthForm,
  buttonComponent: BasicAuthButton
};

export default BasicAuthPlugin;

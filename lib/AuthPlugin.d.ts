import { AuthFormProps, AuthButtonProps } from "./components/AuthProviderSelectionForm";
import { AuthMethod, AuthCredentials } from "./interfaces";
/** Applications can implement this interface if they would like to support authentication
    methods other than basic auth. A list of `AuthPlugin`s can be passed as a prop to the
    `OPDSCatalog` component. */
interface AuthPlugin {
    type: string;
    lookForCredentials: () => {
        credentials?: AuthCredentials;
        error?: string;
    } | null | void;
    formComponent?: React.ComponentType<AuthFormProps<AuthMethod>>;
    buttonComponent: React.ComponentType<AuthButtonProps<AuthMethod>>;
}
export default AuthPlugin;

import { AuthProvider, AuthMethod, ServerSamlMethod } from "./../interfaces";
export declare const SAML_AUTH_TYPE = "http://librarysimplified.org/authtype/SAML-2.0";
export declare function generateCredentials(username: string, password: string): string;
export declare function flattenSamlProviders(providers: AuthProvider<AuthMethod>[]): AuthProvider<AuthMethod>[];
export declare const getEnglishValue: (arr: [{
    language: string;
    value: string;
}]) => string | undefined;
export declare const isServerSamlProvider: (provider: AuthProvider<AuthMethod>) => provider is AuthProvider<ServerSamlMethod>;

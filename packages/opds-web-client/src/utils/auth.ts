import {
  AuthProvider,
  AuthMethod,
  ClientSamlMethod,
  ServerSamlMethod
} from "./../interfaces";

export const SAML_AUTH_TYPE = "http://librarysimplified.org/authtype/SAML-2.0";

export function generateCredentials(username: string, password: string) {
  const btoaStr = btoa(`${username}:${password}`);
  return `Basic ${btoaStr}`;
}

export function flattenSamlProviders(providers: AuthProvider<AuthMethod>[]) {
  return providers.reduce((flattened, provider) => {
    if (isServerSamlProvider(provider)) {
      return [...flattened, ...serverToClientSamlProviders(provider)];
    }
    return [...flattened, provider];
  }, []);
}

function serverToClientSamlProviders(
  provider: AuthProvider<ServerSamlMethod, ClientSamlMethod>
): AuthProvider<ClientSamlMethod>[] {
  return provider.method.links.map(idp => ({
    method: {
      href: idp.href,
      type: provider.method.type,
      description: getEnglishValue(idp.display_names) ?? "Unknown SAML Provider"
    },
    id: idp.href,
    plugin: provider.plugin
  }));
}

export const getEnglishValue = (arr: [{ language: string; value: string }]) =>
  arr.find(item => item.language === "en")?.value;

export const isServerSamlProvider = (
  provider: AuthProvider<AuthMethod>
): provider is AuthProvider<ServerSamlMethod, ClientSamlMethod> =>
  provider.id === SAML_AUTH_TYPE && "links" in provider.method;

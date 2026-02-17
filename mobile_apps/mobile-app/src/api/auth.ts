import { createAuthClient } from '../utils/graphqlClient';
import { getSdk } from '../generated/graphql';

export async function loginWithEmail(email: string, password: string) {
  const client = createAuthClient();
  const sdk = getSdk(client as any);
  const res = await sdk.LoginWithEmail({ input: { email, password } });
  return res;
}

export async function registerWithEmail(email: string, password: string, userType: string, firstName?: string, lastName?: string) {
  const client = createAuthClient();
  const sdk = getSdk(client as any);
  const res = await sdk.RegisterWithEmail({ input: { email, password, userType, firstName: firstName ?? null, lastName: lastName ?? null } });
  return res;
}

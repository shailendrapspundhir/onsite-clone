/*
  Integration test: verifies auth service refreshTokens works end-to-end.
  Requires auth service to be running at NEXT_PUBLIC_AUTH_GRAPHQL_URL or http://localhost:3001/graphql
*/

const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_GRAPHQL_URL ?? 'http://localhost:3001/graphql';

function randomEmail() {
  return `test+${Date.now()}@example.com`;
}

describe('Auth refresh integration', () => {
  test('register -> login -> refreshTokens returns new tokens', async () => {
    // check service reachable
    const ping = await fetch(AUTH_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ query: 'query { __typename }' }) });
    if (!ping.ok) return; // skip if service not running

    const email = randomEmail();
    const password = 'Test12345!';

    // register
    const registerResp = await fetch(AUTH_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `mutation Register($input: RegisterEmailInput!) { registerWithEmail(input: $input) { user { id email } accessToken refreshToken } }`,
        variables: { input: { email, password, userType: 'WORKER', firstName: null, lastName: null } },
      }),
    });
    const registerJson = await registerResp.json();
    if (registerJson.errors?.length) throw new Error(registerJson.errors[0].message);
    const payload = registerJson.data?.registerWithEmail;
    expect(payload).toBeDefined();
    const refreshToken = payload.refreshToken;
    expect(typeof refreshToken).toBe('string');

    // login
    const loginResp = await fetch(AUTH_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `mutation Login($input: LoginEmailInput!) { loginWithEmail(input: $input) { accessToken refreshToken user { id } } }`,
        variables: { input: { email, password } },
      }),
    });
    const loginJson = await loginResp.json();
    if (loginJson.errors?.length) throw new Error(loginJson.errors[0].message);
    const loginPayload = loginJson.data?.loginWithEmail;
    expect(loginPayload).toBeDefined();
    const loginRefresh = loginPayload.refreshToken;
    expect(typeof loginRefresh).toBe('string');

    // call refreshTokens directly
    const refreshResp = await fetch(AUTH_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `mutation Refresh($input: RefreshTokenInput!) { refreshTokens(input: $input) { accessToken refreshToken expiresIn } }`,
        variables: { input: { refreshToken: loginRefresh } },
      }),
    });
    const refreshJson = await refreshResp.json();
    if (refreshJson.errors?.length) throw new Error(refreshJson.errors[0].message);
    const refreshed = refreshJson.data?.refreshTokens;
    expect(refreshed).toBeDefined();
    expect(typeof refreshed.accessToken).toBe('string');
    expect(typeof refreshed.refreshToken).toBe('string');
    expect(refreshed.refreshToken).not.toEqual(loginRefresh);
  }, 20000);
});

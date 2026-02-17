import * as Keychain from 'react-native-keychain';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'mobile_app_access_token';
const REFRESH_KEY = 'mobile_app_refresh_token';
const USER_KEY = 'mobile_app_user';

export async function setToken(token: string) {
  try {
    await Keychain.setGenericPassword('token', token);
    await AsyncStorage.setItem(TOKEN_KEY, token);
  } catch (err) {
    // fallback
    await AsyncStorage.setItem(TOKEN_KEY, token);
  }
}

export async function setRefreshToken(token: string) {
  try {
    await Keychain.setGenericPassword('refresh', token);
    await AsyncStorage.setItem(REFRESH_KEY, token);
  } catch (err) {
    await AsyncStorage.setItem(REFRESH_KEY, token);
  }
}

export async function getRefreshToken(): Promise<string | null> {
  try {
    const creds = await Keychain.getGenericPassword();
    if (creds && creds.password) return creds.password;
  } catch (err) {
    // ignore
  }
  const t = await AsyncStorage.getItem(REFRESH_KEY);
  return t;
}

export async function clearRefreshToken() {
  try {
    await Keychain.resetGenericPassword();
  } catch {}
  await AsyncStorage.removeItem(REFRESH_KEY);
}

export async function getToken(): Promise<string | null> {
  try {
    const creds = await Keychain.getGenericPassword();
    if (creds && creds.password) return creds.password;
  } catch (err) {
    // ignore
  }
  const t = await AsyncStorage.getItem(TOKEN_KEY);
  return t;
}

export async function clearToken() {
  try {
    await Keychain.resetGenericPassword();
  } catch {}
  await AsyncStorage.removeItem(TOKEN_KEY);
}

export async function setUser(user: any) {
  await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
}

export async function getUser(): Promise<any | null> {
  const v = await AsyncStorage.getItem(USER_KEY);
  return v ? JSON.parse(v) : null;
}

export async function clearUser() {
  await AsyncStorage.removeItem(USER_KEY);
}

# mobile-app

React Native CLI app (TypeScript) added to the pnpm workspace. Uses `zustand` for auth state and `graphql-request` to call backend GraphQL services.

Quick run (after installing deps from repo root):

```bash
pnpm install
cd apps/mobile-app
pnpm start
# in a separate terminal
pnpm android
```

Notes:
- Metro is configured to watch the workspace root so shared packages can be imported.
- GraphQL endpoints default to host machine addresses (Android emulator uses `10.0.2.2`).
- This is a RN-CLI skeleton; run `react-native` native setup for Android/iOS as needed.

Native scaffolding:
- To scaffold Android/iOS native projects run the included script from `apps/mobile-app`:

```bash
cd apps/mobile-app
./scripts/init-android.sh
```

Secure storage:
- This app uses `react-native-keychain` and `@react-native-async-storage/async-storage` for token persistence. After native scaffolding, install native modules and run `pod install` on macOS for iOS.

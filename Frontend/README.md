# Frontend (Expo)

This folder contains an Expo-managed React Native app. It is intended to be run using Expo (Metro + Expo Go or a development build).

Quick start (PowerShell on Windows):

```powershell
cd E:\Project\CanteenConnect\Frontend
npm install
npm start   # opens Expo dev tools (scan QR with Expo Go or press 'a' to open Android emulator)
```

Notes:
- Do not run this project with `react-scripts` or other web-only toolchains. Use the Expo CLI (`npm start` / `expo start`).
- To run on Android device/emulator: press `a` in the devtools or run `npm run android`.
- To run on iOS: press `i` in the devtools or run `npm run ios` (macOS required for simulator).

If you want to disable web entirely, remove the `web` script from `package.json` and remove the `web` section in `app.json`.

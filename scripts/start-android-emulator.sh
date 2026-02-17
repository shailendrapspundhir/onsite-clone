#!/usr/bin/env bash
set -euo pipefail

# Usage: AVD_NAME=onsite_avd ./scripts/start-android-emulator.sh
AVD_NAME="${AVD_NAME:-onsite_avd}"
ANDROID_SDK_ROOT="${ANDROID_SDK_ROOT:-$HOME/Android/Sdk}"
export ANDROID_SDK_ROOT
export ANDROID_HOME="$ANDROID_SDK_ROOT"
export PATH="$ANDROID_SDK_ROOT/emulator:$ANDROID_SDK_ROOT/tools/bin:$ANDROID_SDK_ROOT/platform-tools:$PATH"

echo "Using ANDROID_SDK_ROOT=$ANDROID_SDK_ROOT"

if ! command -v emulator >/dev/null 2>&1; then
  echo "Error: 'emulator' not found in PATH. Install Android SDK command-line tools or Android Studio and ensure ANDROID_SDK_ROOT is correct."
  exit 1
fi

if ! emulator -list-avds | grep -qx "$AVD_NAME"; then
  echo "AVD '$AVD_NAME' not found. Attempting to create it."
  SYS_IMG="system-images;android-31;google_apis;x86"
  if ! sdkmanager --list | grep -q "$SYS_IMG"; then
    echo "Installing system image: $SYS_IMG (may require acceptance of licenses)."
    yes | sdkmanager "$SYS_IMG"
  fi
  echo "Creating AVD '$AVD_NAME' with device 'pixel'."
  echo no | avdmanager create avd -n "$AVD_NAME" -k "$SYS_IMG" --device "pixel"
fi

echo "Starting emulator '$AVD_NAME'..."
# Start in background and detach; log to /tmp
nohup emulator -avd "$AVD_NAME" -netdelay none -netspeed full > "/tmp/${AVD_NAME}.log" 2>&1 &
echo "Emulator starting (logs: /tmp/${AVD_NAME}.log}). Give it ~30s to boot."

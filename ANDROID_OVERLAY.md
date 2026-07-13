# Android floating calculator

The floating calculator is a native Android APK feature. It cannot work across other apps from the website or installed PWA because Android only gives the required `Display over other apps` permission to native applications.

## Test the APK without a local Android setup

1. Push the project to GitHub.
2. Open the repository's **Actions** tab.
3. Select **Build Android debug APK** and choose **Run workflow**. A push to `main` that changes the app also starts this workflow automatically.
4. Open the completed workflow and download the `graal-sellables-tools-debug-apk` artifact.
5. Extract `app-debug.apk`, send it to the Android phone, and approve installation from that source.

The debug APK is suitable for private testing. It is not a Play Store release build and should not be used as the final public distribution package. Follow [PLAY_STORE_RELEASE.md](PLAY_STORE_RELEASE.md) to generate signed public artifacts.

## Use the overlay

1. Open the APK and go to **Calculator**.
2. Tap **Enable overlay**.
3. In Android Settings, allow **Display over other apps** for Graal Sellables Tools, then return to the app.
4. Tap **Start overlay** and open Graal or another app.
5. Drag the dark header to move it. Tap `−` to minimize, `□` to expand, or `×` to close it.

The overlay uses a foreground service, so Android shows a persistent notification while it is active. The notification also has a **Stop** action. Calculator totals are stored and synced locally on the device.

## Build locally

Install Node.js 22+, JDK 21, Android Studio, and Android SDK Platform 36. Then run:

```powershell
cd "C:\Users\vjohn\Desktop\sellables-calculator\client"
npm ci
npm run android:sync
npm run android:open
```

Android Studio can install the debug app on a connected device. From a configured terminal, this also builds the APK:

```powershell
npm run android:debug
```

The output is `android/app/build/outputs/apk/debug/app-debug.apk`.

## Before public release

Use the signed-release workflow described in [PLAY_STORE_RELEASE.md](PLAY_STORE_RELEASE.md). Never commit the keystore or its passwords. Also test the overlay permission, notification, dragging, minimization, rotation, and calculator input on multiple Android versions before publishing.

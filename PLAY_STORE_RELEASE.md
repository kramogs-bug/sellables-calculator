# Public Android release guide

The repository is configured to build both public distribution formats:

- `app-release.aab` for Google Play. New Play apps should be uploaded as an Android App Bundle.
- `app-release.apk` for direct distribution from a trusted website or GitHub Release.

The application ID is `com.kramogs.graaltools`. Treat this as permanent after the first Play Store release. The current Android target is API 36.

## 1. Create and protect the upload key

Run this once on a trusted computer. Choose strong passwords and keep the resulting file outside the repository.

```powershell
keytool -genkeypair -v `
  -keystore "$HOME\graal-upload-key.jks" `
  -alias upload `
  -keyalg RSA `
  -keysize 4096 `
  -validity 10000
```

Back up the keystore and its passwords securely. Do not send it in chat, place it in the project, or commit it to Git. The repository ignores `.jks` and `.keystore` files as an additional safeguard.

Encode the keystore for GitHub Actions and copy the result:

```powershell
[Convert]::ToBase64String(
  [IO.File]::ReadAllBytes("$HOME\graal-upload-key.jks")
) | Set-Clipboard
```

In GitHub, open **Repository Settings → Secrets and variables → Actions** and add:

| Secret | Value |
| --- | --- |
| `ANDROID_KEYSTORE_BASE64` | Base64 text copied above |
| `ANDROID_KEYSTORE_PASSWORD` | Keystore password |
| `ANDROID_KEY_ALIAS` | `upload` |
| `ANDROID_KEY_PASSWORD` | Key password |

## 2. Build a signed release

1. Open **Actions → Build signed Android release → Run workflow**.
2. Use `1.0.0` and version code `1` for the first release.
3. Increase the version code for every future Play upload, even if the version name changes only slightly.
4. Download the `graal-sellables-tools-<version>-signed` artifact.

The workflow fails early if a signing secret or version is invalid. It then builds, shrinks, signs, and verifies both artifacts. The R8 `mapping.txt` file is included for diagnosing release crashes.

## 3. Play Console setup

Use the AAB for Google Play and enroll in Play App Signing. Start with an **Internal testing** release before production.

Suggested store copy:

**App name:** Graal Sellables Tools

**Short description:** Calculate sellables and preview head/body fits privately on your device.

**Important listing disclaimer:** This is an unofficial, fan-made utility and is not affiliated with or endorsed by GraalOnline or its publishers.

Provide your own phone screenshots of the Home, Calculator, Tracker, Upload Preview, and active floating calculator. Do not use copyrighted promotional art that you do not own.

Ready-made listing graphics are in `store-assets/`:

- `app-icon-512.png` — 512 × 512 Play Store icon.
- `feature-graphic-1024x500.png` — 1024 × 500 feature graphic.

The matching SVG sources are included so the copy or colors can be adjusted later without degrading image quality.

## 4. Privacy and Data safety

Deploy the website first, confirm that `/privacy` loads directly after a refresh, and use its full public URL in Play Console, for example:

```text
https://YOUR-DOMAIN.example/privacy
```

The current app has no login, analytics, advertising, cloud image upload, or developer-operated data server. Calculator records, tracker records, preview images, and overlay settings remain local. Complete the Data safety form according to the exact production build; review it again whenever a dependency or feature is added.

## 5. Foreground service declaration

The floating calculator is user-started and uses the Android `specialUse` foreground-service type so it can remain visible over another app. In **Play Console → App content**, declare this foreground service.

Suggested functionality description:

> The user explicitly starts a small, draggable calculator that remains visible while they use another app. It provides calculator buttons and locally stored sellables totals, shows an ongoing notification with a Stop action, and can be minimized or closed at any time. It does not inspect, record, or capture the content beneath the overlay.

Suggested interruption impact:

> If delayed or stopped, the calculator immediately disappears and the user cannot continue the cross-app calculation. No user data is lost; the user can reopen the app and start it again.

Record an unlisted demonstration video showing:

1. Opening the Calculator tab.
2. Reading the in-app overlay disclosure.
3. Enabling **Display over other apps**.
4. Starting the overlay.
5. Using it over another app, minimizing it, and dragging it.
6. Stopping it from both the notification and the in-overlay close button.

The manifest already declares `FOREGROUND_SERVICE_SPECIAL_USE`, includes a free-form use-case description, and requests notification permission on supported Android versions.

## 6. Final release checks

- Test installation and upgrades on at least Android 8, Android 13, and Android 15/16 if devices are available.
- Verify calculator expressions, ratios, tracker persistence, pasted/uploaded image validation, and preview export.
- Verify permission denial, permission revocation, rotation, minimize/expand, notification Stop, and task removal.
- Confirm the Sprite Editor is absent from navigation, routes, and the production JavaScript bundle.
- Confirm the Privacy Policy and developer contact are reachable without login.
- Keep the signed AAB, mapping file, store screenshots, and release notes for each version.

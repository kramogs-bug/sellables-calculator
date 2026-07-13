# Graal Sellables Calculator

React and Vite frontend with a sellables calculator, earnings tracker, and a free local Graal body and head preview generator.

## Local development

```powershell
npm install
npm run dev
```

The Body Upload Generator runs entirely in the browser. It can combine a body sheet with an optional head sheet and does not require an API key, environment variable, account, or server-side image service.

Images can be selected from a file or pasted directly from the clipboard. Clipboard images are detected automatically as a body or head sheet from their dimensions.

For the most accurate preview, upload a standard `128 x 720` Graal body PNG and an optional standard `32 x 560` Graal head PNG. The normal up, left, down, and right frames from the first standing row are assembled into a single `32 x 48` character, with the body positioned 16 pixels below the head.

Solid white or colored sprite-sheet backgrounds are removed locally from frame edges before compositing. This can be disabled in the preview controls, and the original uploaded files are not modified.

The default character display is an interactive 360-degree sprite turntable. Drag, swipe, use the keyboard arrows, or enable automatic rotation to move through the front, right, back, and left frames. A four-view comparison mode remains available.

Before an upload, bundled sample character images keep both preview modes populated. Uploaded files are accepted only when they match the standard Graal body or head dimensions and have sprite-sheet-like repeated transparent or solid frame backgrounds; ordinary photos and screenshots are rejected.

## Checks

```powershell
npm run lint
npm run build
```

## Android releases

The Android app includes an optional user-started floating calculator. Debug APKs are built by `.github/workflows/android-debug-apk.yml`. Public signed APK and Android App Bundle artifacts are built by `.github/workflows/android-release.yml` after the repository signing secrets are configured.

See [PLAY_STORE_RELEASE.md](PLAY_STORE_RELEASE.md) for signing, Play Console declarations, privacy policy, and release steps. The unfinished Sprite Editor remains local-only and is intentionally excluded from the public app and Git tracking.

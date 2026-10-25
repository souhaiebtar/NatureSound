# Moodil — Nature Sounds

A mobile-first, installable nature-sound mixer inspired by [moodil.com](https://moodil.com).

## Run

```sh
npm install
npm run dev
```

## Build

```sh
npm run build
npm run preview
```

## Native Android

```sh
export ANDROID_HOME=$HOME/Android/Sdk
export JAVA_HOME=/path/to/jdk-21 # A full JDK 17–21, including javac
npm run android:sync       # Build web assets and copy them into the native app
npm run android:build      # Produce a debug APK
npm run android:open       # Open the native project in Android Studio
```

Debug APK: `android/app/build/outputs/apk/debug/app-debug.apk`.

For a release, run `cd android && ./gradlew assembleRelease`, then ZIP-align and sign `app-release-unsigned.apk` with your private release key. Keep the key and its credentials outside the repository, and retain the same key for all future updates. The current signed artifact is `Moodil-1.0-release.apk`.

The native package is `com.moodil.naturesounds`, with Android 6.0 (API 23) as the minimum supported version. Audio files are packaged as app assets, so nature playback does not require a network connection. While the app is running, a low-priority ongoing notification provides a quick way back; Android 13+ asks for notification permission on first launch.

## Audio

All 38 long-form Ogg recordings are bundled in `public/sounds/`, grouped by sound (`rain`, `forest`, `bird`, etc.). Each filename matches its Moodil variation, such as `rain/rain_dense.ogg`. Playback works without third-party audio requests after the app and selected sounds have loaded.

Audio source: `https://www.moodil.com/sounds/long/<sound_variation>.ogg`. The recordings remain the property of their respective owners; verify redistribution rights before publishing an app or production bundle.

SoundCloud tracks use the official embedded SoundCloud player. The download action opens the original SoundCloud page; downloads are available only where the artist has enabled them. No stream ripping or access-control bypass is included.

## Features

- Layer any of 15 sound types and adjust each layer's volume and variation
- Curated mixes, custom saved mixes, and local persistence
- Global pause, sleep timer, search, filters, and responsive navigation
- SoundCloud track and playlist imports
- Installable PWA manifest for an Android app-like experience

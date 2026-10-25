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

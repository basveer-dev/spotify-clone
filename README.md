## Spotify Clone (Vanilla JS)

A lightweight, open-source Spotify-like web player built with plain HTML, CSS, and JavaScript. It plays local MP3s organized by folders, shows album cards from simple JSON metadata, and includes a responsive UI with a playbar, seek, next/previous, and volume controls.

This project is free and open-source. Clone it, customize it, and use it for learning or as a base for your own player.

### Features
- Responsive UI with left library pane and right playlist/cards grid
- Plays MP3 files from local `songs/<album>/` folders
- Album cards powered by simple `info.json` metadata
- Play/Pause, Next/Previous, Seek bar, Volume + Mute
- No frameworks required (pure HTML/CSS/JS)

### Project Structure
```
spotify-clone/
  index.html
  css/
    style.css
    utility.css
  js/
    script.js
  src/assets/
    ... svg icons ...
  songs/
    <album-folder-1>/
      cover.jpg
      info.json
      <track1>.mp3
      <track2>.mp3
    <album-folder-2>/
      cover.jpg
      info.json
      <track>.mp3
```

### Quick Start
Because the app uses `fetch` to read directories and JSON, you must run it from a local web server (double-clicking `index.html` will not work reliably).

Pick any one option below:

#### Option A: VS Code – Live Server (Recommended on Windows)
1. Open the project folder in VS Code.
2. Install the "Live Server" extension by Ritwick Dey.
3. Right-click `index.html` → "Open with Live Server".
4. A browser tab will open (e.g., `http://127.0.0.1:5500/`).

#### Option B: Node (serve)
```bash
npx serve .
# or install globally
# npm i -g serve && serve .
```
Then open the URL printed in the terminal.

#### Option C: Python 3 (built-in http server)
```bash
python -m http.server 8000
```
Then open `http://localhost:8000/` in your browser.

### Usage
- The home grid shows albums by scanning `songs/` for subfolders.
- Click an album card to load its tracks into the playlist on the left.
- Click a track to start playback.
- Use the playbar controls (Play/Pause, Next/Previous, Seek, Volume/Mute).

### Adding Your Own Music
1. Create a new folder under `songs/` (e.g., `songs/myalbum`).
2. Put your MP3 files inside that folder.
3. Add a `cover.jpg` image to that folder (shown on the album card).
4. Create `info.json` in the same folder with the following structure:
```json
{
  "Title": "My Album Name",
  "Description": "Short description of the album"
}
```
Notes:
- File names can contain spaces; they will be URL-encoded and displayed nicely.
- Only `.mp3` files are listed as tracks per album.

### Troubleshooting
- 404 errors for `info.json` or `cover.jpg`:
  - Ensure each album folder contains both `cover.jpg` and `info.json` with valid JSON.
- "Unexpected token '<' ... is not valid JSON":
  - Usually a directory index HTML page was fetched instead of JSON. Make sure the URL points to `songs/<album>/info.json` and that you're running a local server.
- Nothing shows in the album grid:
  - Verify your local server returns directory listings for `songs/` (the app discovers subfolders via links in the index listing).
  - Alternatively, manually add known album folders to the code if your server hides indexes.
- Audio does not play:
  - Check the browser console for blocked autoplay; click once on the page then press play.

### Development
- All logic is in `js/script.js`.
- UI styles in `css/style.css` and `css/utility.css`.
- SVG assets in `src/assets/`.
- The app discovers albums by reading the directory listing of `songs/` and filtering valid `songs/<folder>/` paths, then loads `info.json` for metadata.

### Contributing
Contributions are welcome! Feel free to:
- Report issues
- Submit pull requests (refactors, new features, fixes)
- Improve UI/UX or add keyboard shortcuts

Please keep code readable and follow the existing style: plain JS, clear naming, and no framework dependencies unless discussed.

### License (MIT)
```
MIT License

Copyright (c) 2025

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

If you use this project, a star is appreciated. Enjoy the music!



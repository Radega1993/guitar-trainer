# Audio asset convention

## Notes by guitar position

Folder: `assets/audio/notes/`

Format: `c{string}t{fret}.mp3`

Examples:
- `c1t0.mp3` -> string 1 fret 0
- `c2t10.mp3` -> string 2 fret 10
- `c6t3.mp3` -> string 6 fret 3

## Feedback sounds

Folder: `assets/audio/feedback/`

Required files:
- `correct.mp3`
- `wrong.mp3`
- `tap.mp3` (optional if fret tap sound is disabled)

## Recording notes

- Use mono files when possible to reduce size.
- Keep sample rate and normalization consistent across all files.
- Replace temporary placeholders with real recordings keeping the exact filenames.

# Supplied reference assets

## Skill logos and concept icons

The local SVGs in `public/skill-icons/` were downloaded from [Devicon](https://github.com/devicons/devicon) (brand logos) and [Lucide](https://lucide.dev/) (symbols for non-brand concepts such as DSA and networking). Brand marks are used to identify the corresponding technologies. They remain the property of their respective owners.

`public/skill-icons/SOURCES.json` records the exact upstream revisions, individual source URLs, and file hashes. Original licenses are included as `DEVICON-LICENSE.txt` and `LUCIDE-LICENSE.txt`. Lucide's `currentColor` stroke is set to the portfolio's teal for standalone image rendering. Brand SVG files retain their downloaded colors; the interface uses display filters for softer saturation and warm light ink on dark, single-color marks.

## House reference

The user supplied `../refernce/IamErfan` as the visual reference and requested use of its house model. These assets are retained from that reference:

- `public/models/portfolio-house.glb` (originally `main-draco.glb`)
- `public/models/house-preview.png` (originally `IMG_6140.png`)
- `components/reference/camera-path.json` (the saved Theatre.js camera sequence)
- `public/draco/` (Google Draco decoder distribution)

The reference README states:

> © 2025 Erfan Mirasadi. All Rights Reserved.
>
> This is a proprietary personal portfolio. While the code is open for educational study and inspiration, commercial adoption, cloning, or redistribution of the 3D models and brand identity is strictly prohibited.

This local adaptation does not change those terms or claim authorship of the supplied model. Distribution of the reference assets requires the rights holder's permission. No deployment is performed by this implementation.

The reference's displayed identity, biography, project content, links, and embedded project screen atlas are replaced at runtime with Kanav Trivedi's portfolio content. Legal attribution is retained here separately.

Draco is licensed under Apache 2.0: https://github.com/google/draco/blob/main/LICENSE. The decoder files retain their original headers. The fonts' OFL licenses are included under `public/fonts/`.

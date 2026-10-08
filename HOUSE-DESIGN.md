# The Trivedi house

The user-supplied reference house and its authored camera sequence form a seven-stop tour of Kanav's portfolio. The route covers the introduction, biography, experience, recognition, skills, projects, and contact details. The reference's personal content is replaced with Kanav's résumé details and project information.

The visual system pairs ink blue (`#0c191b`), deep teal (`#102529`), warm brass (`#d6b98b`), ivory (`#f0ece2`), and muted sage (`#b2bfb9`) with the detailed industrial interior. Outfit carries the architectural headings; DM Sans handles reading and navigation. Both fonts are served locally, with their OFL licenses in `public/fonts`.

The house is the primary visual, with readable HTML content in a separate reading column. The workshop features only ReFace, Vanaspati, SkillVerse, CAD-C, and SSTC. Four physical displays show the projects; the fourth switches between CAD-C and SSTC. Every project also has keyboard-accessible tabs and a source link. Available public demos are linked, including the user-provided ReFace URL.

The skills section contains languages, backend APIs, frontend and 3D tools, databases, machine learning, core computer-science concepts, and development/cloud tools. Content comes from the existing portfolio, résumé, and project technologies, without invented proficiency percentages. Laboratory monitors show grids of four to six labeled logos each, covering all 37 skills across seven groups. Brand logos come from Devicon; non-brand concepts use Lucide symbols. All SVGs are local, with source revisions and licenses retained in `public/skill-icons/`. The same artwork appears beside the HTML skill labels. Missing images fall back to labeled tiles and do not block the tour.

Skill artwork uses dark glass panels, fine brass edges, subtle screen reflections, and a soft amber glow to match the model's industrial interior. Multicolor logos have slightly muted saturation; dark single-color logos and concept symbols use warm light ink for contrast. The HTML skill badges use the same treatment. Source SVG files remain intact.

Normal room sections are 160svh on desktop and 140svh on mobile. Camera movement spans 70% of the distance between room starts, with damping reduced from 5 to 2.2 for a slower response. The projects view has a longer hold. Reduced motion changes directly between room views. Native page scrolling remains available.

## Working on the portfolio

Run `npm run dev`, then open http://localhost:3000. Run `npm run build` for production and `npm test` for camera sampling, screen personalization, and model/project checks.

- `components/house/portfolio-data.js`: the five projects, skills, room names, and recognition.
- `components/house/HousePortfolio.js`: content, accessible project tabs, room directory, and scroll progress.
- `components/reference/ReferenceHouseScene.js`: local GLB loading, lighting, camera, project interactions, and resource disposal.
- `components/reference/camera-sampler.js`: samples the saved Theatre.js camera route without adding the Theatre runtime.
- `components/reference/personalize-model.js`: replaces the reference's embedded screen atlas with Kanav's display textures.
- `components/reference/skill-screens.js`: loads local logos and draws grouped monitor displays.
- `components/house/skill-icons.js`: maps each skill to its downloaded artwork.
- `scripts/download-skill-icons.mjs`: refreshes logo assets and records their upstream sources.
- `app/house.css` and `app/reference.css`: base layout and the reference interior's visual theme.
- `THIRD-PARTY-NOTICES.md`: provenance and original terms for the supplied assets.

The renderer limits pixel density and frame rate and pauses when the tab is hidden. Reduced motion follows the operating system setting and can also be selected in the page. The loader reports real download progress and can be dismissed while the house loads. HTML content and the expanded project directory remain available without WebGL. The model, decoder, camera sequence, fonts, and project images are served locally. The earlier procedural scene modules are retained but are not mounted by the current page.

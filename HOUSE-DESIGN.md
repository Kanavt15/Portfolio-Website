# The Trivedi house

A countryside house becomes a directory for Kanav's work. The garden introduces the portfolio, the living room holds the biography, the gallery presents projects, the study shows skills, the library describes experience, the landing displays recognition, and the sunroom invites a conversation.

The visual system uses warm white (`#f7f8f2`), forest (`#263f34`, `#365641`), pale sky (`#dce6e2`), sage (`#aab69a`), and oak (`#997554`). Outfit carries the architectural headings; DM Sans handles reading and navigation. Both fonts are served locally, with their OFL licenses in `public/fonts`.

The house is the primary visual. Supporting UI stays quiet, aligned to a single reading column. The project gallery receives the most space, a large interactive project panel, and a matching display inside the house. Room views hold before moving to the next stop so motion does not compete with reading.

## Working on the portfolio

Run `npm run dev`, then open http://localhost:3000. Run `npm run build` for production and `npm test` for the visitor-path and scene-lifecycle checks.

- `components/house/portfolio-data.js`: project links, room names, and recognition.
- `components/house/HousePortfolio.js`: content, accessible project tabs, room directory, and scroll progress.
- `components/house/create-house.js`: procedural architecture, furniture, landscape, and project displays.
- `components/house/HouseScene.js`: lazy WebGL initialization, camera, room cutaways, visitor animation, and disposal.
- `components/house/tour-motion.js`: camera stops and continuous walking path, including stairs.
- `app/house.css`: typography, layout, loading scene, and responsive styles.

The renderer limits pixel density and frame rate, reduces shadow resolution on phones, and pauses when the tab is hidden. Reduced motion follows the operating system setting and can also be selected in the page. Content remains available when JavaScript or WebGL is unavailable. No external model or animation assets are required.

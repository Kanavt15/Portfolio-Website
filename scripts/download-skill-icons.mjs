import { mkdir, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { skillIcons } from "../components/house/skill-icons.js";

const destination = new URL("../public/skill-icons/", import.meta.url);
const concepts = new Set([
  "database",
  "webhook",
  "shield-check",
  "database-zap",
  "brain-circuit",
  "list-filter",
  "workflow",
  "boxes",
  "database-backup",
  "monitor-cog",
  "network",
]);
const variants = {
  express: "original",
  threejs: "original",
  amazonwebservices: "original-wordmark",
};

async function fetchText(url) {
  const response = await fetch(url, { signal: AbortSignal.timeout(30000) });
  if (!response.ok) throw new Error(`${response.status}: ${url}`);
  return response.text();
}

await mkdir(destination, { recursive: true });
const repositories = {
  devicon: { repo: "devicons/devicon", branch: "master" },
  lucide: { repo: "lucide-icons/lucide", branch: "main" },
};
for (const repo of Object.values(repositories)) {
  const commit = JSON.parse(
    await fetchText(
      `https://api.github.com/repos/${repo.repo}/commits/${repo.branch}`,
    ),
  );
  repo.commit = commit.sha;
  if (!/^[a-f0-9]{40}$/.test(repo.commit))
    throw new Error("Could not pin icon revision");
}

const entries = [];
// Small download batches avoid overwhelming the upstream raw-file service.
const icons = [...new Set(Object.values(skillIcons))];
for (let start = 0; start < icons.length; start += 6) {
  await Promise.all(
    icons.slice(start, start + 6).map(async (icon) => {
      const concept = concepts.has(icon);
      const provider = concept ? "lucide" : "devicon";
      const repo = repositories[provider];
      const path = concept
        ? `icons/${icon}.svg`
        : `icons/${icon}/${icon}-${variants[icon] || "original"}.svg`;
      const source = `https://raw.githubusercontent.com/${repo.repo}/${repo.commit}/${path}`;
      let svg = await fetchText(source);
      if (
        !svg.includes("<svg") ||
        /<script|<foreignObject|\bon\w+\s*=|(?:href|src)\s*=\s*["']https?:/i.test(
          svg,
        )
      )
        throw new Error(`Unexpected SVG content: ${icon}`);
      if (concept) svg = svg.replaceAll("currentColor", "#365f62");
      await writeFile(new URL(`${icon}.svg`, destination), svg);
      entries.push({
        file: `${icon}.svg`,
        provider,
        kind: concept ? "concept symbol" : "brand logo",
        source,
        sha256: createHash("sha256").update(svg).digest("hex"),
      });
      console.log(`${provider}: ${icon}`);
    }),
  );
}
for (const [provider, repo] of Object.entries(repositories)) {
  const license = await fetchText(
    `https://raw.githubusercontent.com/${repo.repo}/${repo.commit}/LICENSE`,
  );
  await writeFile(
    new URL(`${provider.toUpperCase()}-LICENSE.txt`, destination),
    license,
  );
}
await writeFile(
  new URL("SOURCES.json", destination),
  JSON.stringify(
    {
      repositories,
      icons: entries.sort((a, b) => a.file.localeCompare(b.file)),
    },
    null,
    2,
  ) + "\n",
);
console.log(`Saved ${entries.length} local SVGs with source attribution.`);

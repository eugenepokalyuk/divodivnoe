import {
  mkdir,
  readFile,
  readdir,
  copyFile,
  rm,
  writeFile,
} from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Keep immutable assets for tabs still running a previous deployment.
// Track when each asset was last built, rather than when a cache was restored.
export async function preserveChunks(output, history, now = Date.now()) {
  const retention = 7 * 24 * 60 * 60 * 1000;
  const manifestPath = path.join(history, 'manifest.json');
  let manifest = {};
  try {
    manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }

  async function visit(directory, prefix = '') {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const relative = path.join(prefix, entry.name);
      if (entry.isDirectory()) {
        await visit(path.join(directory, entry.name), relative);
      } else if (entry.isFile()) {
        const target = path.join(history, 'static', relative);
        await mkdir(path.dirname(target), { recursive: true });
        await copyFile(path.join(directory, entry.name), target);
        manifest[relative] = now;
      }
    }
  }

  const staticDir = path.join(output, '_next', 'static');
  await visit(staticDir);
  for (const [relative, lastBuilt] of Object.entries(manifest)) {
    const source = path.join(history, 'static', relative);
    if (now - lastBuilt > retention) {
      await rm(source, { force: true });
      delete manifest[relative];
      continue;
    }
    const target = path.join(staticDir, relative);
    await mkdir(path.dirname(target), { recursive: true });
    await copyFile(source, target);
  }
  await writeFile(manifestPath, JSON.stringify(manifest));
}

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  await preserveChunks('out', '.chunk-history');
}

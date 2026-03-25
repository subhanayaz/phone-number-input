import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const repoRoot = path.resolve(new URL('..', import.meta.url).pathname);
const playgroundDirectory = path.join(repoRoot, 'playground');

if (!fs.existsSync(playgroundDirectory)) {
  throw new Error(`Missing playground directory at ${playgroundDirectory}`);
}

execSync('npm run build', { cwd: repoRoot, stdio: 'inherit' });

const packedFilename = execSync('npm pack --silent', { cwd: repoRoot, encoding: 'utf8' }).trim().split('\n').pop();
if (!packedFilename) {
  throw new Error('npm pack did not return a tarball filename');
}

const tarballPath = path.join(repoRoot, packedFilename);
if (!fs.existsSync(tarballPath)) {
  throw new Error(`Packed tarball not found at ${tarballPath}`);
}

const playgroundNodeModules = path.join(playgroundDirectory, 'node_modules');
if (!fs.existsSync(playgroundNodeModules)) {
  execSync('npm install', { cwd: playgroundDirectory, stdio: 'inherit' });
}

execSync(`npm install --no-save "${tarballPath}"`, { cwd: playgroundDirectory, stdio: 'inherit' });

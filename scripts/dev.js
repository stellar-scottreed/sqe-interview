// Runs the backend (API, port 4000) and frontend (Vite dev server, port 5173)
// together with one command and no external dependencies.

const { spawn } = require('child_process');
const path = require('path');

const root = path.join(__dirname, '..');

function run(name, color, command, args, cwd) {
  const child = spawn(command, args, { cwd, shell: true });
  const tag = `\x1b[${color}m[${name}]\x1b[0m`;
  child.stdout.on('data', (d) => process.stdout.write(prefix(tag, d)));
  child.stderr.on('data', (d) => process.stderr.write(prefix(tag, d)));
  child.on('exit', (code) => {
    console.log(`${tag} exited with code ${code}`);
    process.exit(code || 0);
  });
  return child;
}

function prefix(tag, buf) {
  return buf
    .toString()
    .split('\n')
    .map((line, i, arr) => (i === arr.length - 1 && line === '' ? '' : `${tag} ${line}`))
    .join('\n');
}

const api = run('api', '34', 'npm', ['--prefix', 'backend', 'run', 'dev'], root);
const web = run('web', '32', 'npm', ['--prefix', 'frontend', 'run', 'dev'], root);

process.on('SIGINT', () => {
  api.kill('SIGINT');
  web.kill('SIGINT');
  process.exit(0);
});

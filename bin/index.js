#!/usr/bin/env node
// @flow
const fs = require('fs');

const yargs = require('yargs');
const { hideBin } = require('yargs/helpers');

const argv = yargs(hideBin(process.argv)).argv;
const [
  dep,
  _from,
  _to,
] = argv._;

function main() {
  const from = _from || 'devDependencies';
  const to = (() => {
    if (from === 'devDependencies') return 'dependencies';
    if (from === 'dependencies') return 'depDependencies';
    return _to;
  })();

  if (!to) {
    console.error("Shift to value cannot be inferred, please specify it directly with the 3rd argument")
  }

  if (!dep) {
    console.error("Please pass the dependency you'd like to shift as the 1st argument");
    return;
  }

  try {
    const contents = fs.readFileSync('package.json', 'utf-8');
    const pkgJson = JSON.parse(contents);

    const a = pkgJson[from];

    if (!a[dep]) {
      console.error(`Dependency does not exist in ${from}`);
      return;
    }

    const lines = contents.split('\n');
    const fromIndex = lines.findIndex((line) => {
       [
          `"${from}": {`,
          `"${from}": {}`,
       ].includes(line.trim())
    });
    const depSwap = lines.splice(
      lines.findIndex((line) => line.trim().startsWith(`"${dep}": `)) || 0,
      0,
    );
    fs.writeFileSync('package.json', lines.join('\n'));
  } catch(e) {
    console.log(e);
    console.error('Could not find `package.json` in current dir');
    return;
  }
}

main();


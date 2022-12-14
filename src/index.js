// @flow
const fs = require('fs');

function main(cwd/*: string*/, dep/*: string*/, _from/*: string*/, _to/*: string*/) {
  const from = _from || 'devDependencies';
  const to = (() => {
    if (from === 'devDependencies') return 'dependencies';
    if (from === 'dependencies') return 'devDependencies';
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
    const contents = fs.readFileSync(`${cwd}/package.json`, 'utf-8');
    const pkgJson = JSON.parse(contents);

    const a = pkgJson[from];

    if (!a[dep]) {
      console.error(`Dependency ${dep} does not exist in ${from}`);
      return;
    }

    const lines = contents.split('\n');
    const shiftRows = lines.splice(
      lines.findIndex((line) => line.trim().startsWith(`"${dep}": `)) || 0,
      1,
    );

    const fromStart = lines.findIndex((line) => line.trim().startsWith(`"${from}": {`));
    const fromEnd = lines.findIndex((line, i) => (
      line.trim().startsWith('}') && i > fromStart
    ));
    const fromList = lines.slice(fromStart + 1, fromEnd);

    lines.splice(
      fromStart + 1,
      fromList.length,
      ...fromList.map((line, i) => {
        if (line.endsWith(',') && i === fromList.length - 1) {
          return line.substring(0, line.length - 1);
        }
        if (!line.endsWith(',') && i !== fromList.length - 1) {
          return `${line},`;
        }
        return line;
      }),
    );

    const toStart = lines.findIndex((line) => line.trim().startsWith(`"${to}": {`));
    const toEmpty = lines.findIndex((line) => line.trim().startsWith(`"${to}": {}`));

    if (toStart === -1) {
      // If there's no to list
      lines.splice(
        fromStart,
        0,
        `${lines[fromStart].substring(0, lines[fromStart].indexOf('"'))}"${to}": {`,
        ...shiftRows.map((o) => {
          if (o.endsWith(',')) {
            return o.substring(0, o.length - 1);
          }
          return o;
        }),
        `${lines[fromStart].substring(0, lines[fromStart].indexOf('"'))}},`,
      );
    } else if (toEmpty !== -1) {
      // If the to list is empty
      lines.splice(
        toEmpty,
        1,
        lines[toEmpty].substring(0, lines[toEmpty].indexOf('}')),
        ...shiftRows,
        `${lines[toEmpty].substring(0, lines[toEmpty].indexOf('"'))}${lines[toEmpty].substring(lines[toEmpty].indexOf('}'))}`,
      );
    } else {

      const toEnd = lines.findIndex((line, i) => (
        line.trim().startsWith('}') && i > toStart
      ));

      lines.splice(
        toStart + 1,
        0,
        ...shiftRows,
      );

      const toList = lines.slice(toStart + 1, toEnd + 1);
      toList.sort();

      lines.splice(
        toStart + 1,
        toList.length,
        ...toList.map((line, i) => {
          if (line.endsWith(',') && i === toList.length - 1) {
            return line.substring(0, line.length - 2);
          }
          if (!line.endsWith(',') && i !== toList.length - 1) {
            return `${line},`;
          }
          return line;
        }),
      );
    }

    fs.writeFileSync(`${cwd}/package.json`, lines.join('\n'));
  } catch(e) {
    console.log(e);
    console.error('Could not find `package.json` in current dir');
    return;
  }
}

module.exports = main;

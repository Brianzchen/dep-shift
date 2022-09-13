// @flow
const fs = require('fs');

const main = require('.');

describe('main', () => {
  const fixturePath = '__fixtures__';
  const fixturePkg = `${fixturePath}/package.json`;

  beforeEach(() => {
    fs.mkdirSync(fixturePath);
  });

  afterEach(() => {
    fs.rmdirSync(fixturePath, { recursive: true });
  })

  it('can shift devDependency to dependencies by default', () => {
    const pkgJson = `
{
  "dependencies": {
    "react": "1.2.3"
  },
  "devDependencies": {
    "lodash": "4.0.0"
  }
}
    `;
    fs.writeFileSync(fixturePkg, pkgJson);

    main(fixturePath, 'lodash', '', '');

    expect(fs.readFileSync(fixturePkg, 'utf-8')).toBe(`
{
  "dependencies": {
    "lodash": "4.0.0",
    "react": "1.2.3"
  },
  "devDependencies": {
  }
}
    `);
  });

  it('can insert into empty to list', () => {
    const pkgJson = `
{
  "dependencies": {},
  "devDependencies": {
    "lodash": "4.0.0"
  }
}
    `;
    fs.writeFileSync(fixturePkg, pkgJson);

    main(fixturePath, 'lodash', '', '');

    expect(fs.readFileSync(fixturePkg, 'utf-8')).toBe(`
{
  "dependencies": {
    "lodash": "4.0.0"
  },
  "devDependencies": {
  }
}
    `);
  });

  it('adds to list if it does not exist', () => {
    const pkgJson = `
{
  "devDependencies": {
    "lodash": "4.0.0"
  }
}
    `;
    fs.writeFileSync(fixturePkg, pkgJson);

    main(fixturePath, 'lodash', '', '');

    expect(fs.readFileSync(fixturePkg, 'utf-8')).toBe(`
{
  "dependencies": {
    "lodash": "4.0.0"
  },
  "devDependencies": {
  }
}
    `);
  });

  it('adds to list if it does not exist', () => {
    const pkgJson = `
{
  "devDependencies": {
    "bar": "1.0.0",
    "foo": "2.0.0",
    "lodash": "4.0.0",
    "typescript": "1.2.3",
    "webpack": "4.0.0"
  }
}
    `;
    fs.writeFileSync(fixturePkg, pkgJson);

    main(fixturePath, 'typescript', '', '');

    expect(fs.readFileSync(fixturePkg, 'utf-8')).toBe(`
{
  "dependencies": {
    "typescript": "1.2.3"
  },
  "devDependencies": {
    "bar": "1.0.0",
    "foo": "2.0.0",
    "lodash": "4.0.0",
    "webpack": "4.0.0"
  }
}
    `);
  });

  it('adds to a list that has one dep from a long list', () => {
    const pkgJson = `
{
  "dependencies": {
    "typescript": "1.2.3"
  },
  "devDependencies": {
    "bar": "1.0.0",
    "foo": "2.0.0",
    "lodash": "4.0.0",
    "webpack": "4.0.0"
  }
}
    `;
    fs.writeFileSync(fixturePkg, pkgJson);

    main(fixturePath, 'lodash', '', '');

    expect(fs.readFileSync(fixturePkg, 'utf-8')).toBe(`
{
  "dependencies": {
    "lodash": "4.0.0",
    "typescript": "1.2.3"
  },
  "devDependencies": {
    "bar": "1.0.0",
    "foo": "2.0.0",
    "webpack": "4.0.0"
  }
}
    `);
  });
});

// @flow
import main from '.';

describe('main', () => {
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
  });
});

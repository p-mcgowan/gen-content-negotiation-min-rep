const versionCheck = require('npm-tool-version-check');
versionCheck.default = () => Promise.resolve();

const genDepCheck = require('generate-it/build/lib/diff/DisplayDependencyDiffs');
genDepCheck.default.check = () => null;

const generator = require('generate-it/build/lib/FileIterator');
const orig = generator.default.walk.bind(generator.default);
generator.default.walk = async function () {
  const res = await orig(...arguments);
  require('fs').unlinkSync('changelog.generate-it.json');

  return res;
}

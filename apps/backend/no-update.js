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

// const paramsOutputReducer = require('generate-it/build/lib/template/helpers/paramsOutputReducer');
// const porOrig = paramsOutputReducer.default;
// paramsOutputReducer.default = (responses) => {
//   const res = porOrig(responses);
//   console.dir({responses, res}, { depth: null });
//   return res;
// }
// const pathParamsToDomainParams = require('generate-it/build/lib/template/helpers/pathParamsToDomainParams');
// const pptdpOrig = pathParamsToDomainParams.default;

// pathParamsToDomainParams.default = function() {
//   const res = pptdpOrig(...arguments);

//   console.dir(arguments, { depth: null });
//   return res;
// }

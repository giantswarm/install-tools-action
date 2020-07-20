const core = require('@actions/core');
const github = require('@actions/github');
const tc = require('@actions/tool-cache');

try {
  const semverP = await core.group('Install semver', async () => {
    const semverVersion = core.getInput('semver');
    const semverDonwloadURL = `https://github.com/fsaintjacques/semver-tool/archive/${semverVersion}.tar.gz`
    installTool('semver', semverVersion, semverDonwloadURL)
  })

  await semverP
} catch (error) {
  core.setFailed(error.message);
}

function installTool(name, version, url) {
  var cachedPath = tc.find(name, version)
  if (cachedPath) {
    core.addPath(cachedPath)
    return
  }

  const path = await tc.downloadTool(semverDonwloadURL);
  const dir = await tc.extractTar(path, 'semver/');
  cachedPath = await tc.cacheDir(dir, name, version);
  core.addPath(cachedPath)
}

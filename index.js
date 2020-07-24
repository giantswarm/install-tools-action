const core = require('@actions/core');
const exec = require('@actions/exec');
const glob = require('@actions/glob');
const tc = require('@actions/tool-cache');

async function run() {
  try {
    core.info('Install architect')
    const architectVersion = core.getInput('architect');
    const architectDownloadURL = `https://github.com/giantswarm/architect/releases/download/v${architectVersion}/architect-v${architectVersion}-linux-amd64.tar.gz`
    await installTool('architect', architectVersion, architectDownloadURL, 1, '*/architect')

    core.info('Install semver')
    const semverVersion = core.getInput('semver');
    const semverDonwloadURL = `https://github.com/fsaintjacques/semver-tool/archive/${semverVersion}.tar.gz`
    await installTool('semver', semverVersion, semverDonwloadURL, 2, '*/src/semver')
  } catch (error) {
    core.setFailed(error.message);
  }
}

async function installTool(name, version, url, stripComponents, wildcard) {
  var cachedPath = tc.find(name, version)
  if (cachedPath) {
      core.addPath(cachedPath)
      return
  }


  const path = await tc.downloadTool(url);

  await exec.exec(`mkdir ${name}`)
  await exec.exec(`tar -C ${name} -xzvf ${path} --strip-components ${stripComponents} --wildcards ${wildcard}`)

  cachedPath = await tc.cacheDir(name, name, version);
  core.addPath(cachedPath)
}

run();

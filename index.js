const core = require('@actions/core');
const exec = require('@actions/exec');
const glob = require('@actions/glob');
const tc = require('@actions/tool-cache');

async function run() {
  try {
    core.info('Install semver')
    const semverVersion = core.getInput('semver');
    const semverDonwloadURL = `https://github.com/fsaintjacques/semver-tool/archive/${semverVersion}.tar.gz`
    installTool('semver', semverVersion, semverDonwloadURL)
  } catch (error) {
    core.setFailed(error.message);
  }
}

async function installTool(name, version, url) {
  try {
    var cachedPath = tc.find(name, version)
    if (cachedPath) {
        core.addPath(cachedPath)
        return
    }


    const path = await tc.downloadTool(url);

    await exec.exec(`mkdir ${name}`)
    await exec.exec(`tar -C ${name} -xzvf ${path} --strip-components 1 --wildcards */${name}`)

    cachedPath = await tc.cacheDir(name, name, version);
    core.addPath(cachedPath)
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();

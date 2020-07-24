const core = require('@actions/core');
const exec = require('@actions/exec');
const glob = require('@actions/glob');
const tc = require('@actions/tool-cache');

async function run() {
  try {
    let p1 = core.group('Install architect', async () => {
      const version = core.getInput('architect');
      const url = `https://github.com/giantswarm/architect/releases/download/v${architectVersion}/architect-v${architectVersion}-linux-amd64.tar.gz`
      await installTool('architect', version, url, 1, '*/architect')
    })

    let p2 = core.group('Install semver', async () => {
        const semverVersion = core.getInput('semver');
        const semverDonwloadURL = `https://github.com/fsaintjacques/semver-tool/archive/${semverVersion}.tar.gz`
        await installTool('semver', semverVersion, semverDonwloadURL, 2, '*/src/semver')
    })

    await p1
    await p2
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

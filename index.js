const core = require('@actions/core');
const exec = require('@actions/exec');
const tc = require('@actions/tool-cache');

async function run() {
  try {
    await core.group('Install architect', async () => {
      const version = core.getInput('architect_version');
      const url = `https://github.com/giantswarm/architect/releases/download/v${version}/architect-v${version}-linux-amd64.tar.gz`
      await installTool('architect', version, url, 1, '*/architect')
      await exec.exec(`architect version`)
    })

    await core.group('Install devctl', async () => {
      const version = core.getInput('devctl_version');
      const url = `https://github.com/giantswarm/devctl/releases/download/v${version}/devctl-v${version}-linux-amd64.tar.gz`
      await installTool('devctl', version, url, 1, '*/devctl')
      await exec.exec(`devctl version`)
    })

    await core.group('Install semver', async () => {
      const version = core.getInput('semver_version');
      const url = `https://github.com/fsaintjacques/semver-tool/archive/${version}.tar.gz`
      await installTool('semver', version, url, 2, '*/src/semver')
      await exec.exec(`semver --version`)
    })
  } catch (error) {
    core.setFailed(error.message);
  }
}

async function installTool(name, version, url, stripComponents, wildcard) {
  let cachedPath = tc.find(name, version)
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

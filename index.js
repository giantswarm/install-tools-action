const core = require('@actions/core');
const exec = require('@actions/exec');
const tc = require('@actions/tool-cache');

async function run() {

  try {
    const fillTemplate = function(s) {
      new Function("return `" + s + "`;").call()
    }

    let binary = core.getInput('binary');
    let version = core.getInput('version');
    let downloadURL = core.getInput('download_url');
    let tarballBinaryPath = core.getInput('tarball_binary_path');
    let smokeTest = core.getInput('smoke_test');

    version = fillTemplate(version)
    downloadURL = fillTemplate(downloadURL)
    tarballBinaryPath = fillTemplate(tarballBinaryPath)
    smokeTest = fillTemplate(smokeTest)

    const stripComponents = tarballBinaryPath.split("/").length - 1

    await installTool(binary, version, downloadURL, stripComponents, tarballBinaryPath)
    await exec.exec(smokeTest)
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

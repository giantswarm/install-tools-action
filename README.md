# install-tools-action

⚠️ ⚠️ ⚠️ This action is deprecated. Use [install-binary-action](https://github.com/giantswarm/install-binary-action) instead. ⚠️ ⚠️ ⚠️

This action installs binaries used in Giant Swarm workflows. To see what tools
are installed check `*_version` inputs defined in [action.yml](./action.yml).

## Inputs

### `TOOL_version`

**Optional.** This is the tool version to be installed if there is a need to
install other version than the default, e.g.: `architect_version: 3.0.0`.

## Outputs

This action doesn't have any outputs.

## Example usage

```yaml
uses: giantswarm/install-tools-action@VERSION
```

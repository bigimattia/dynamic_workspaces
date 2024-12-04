# Dynamic Workspaces

A KWin script that dynamically creates and deletes virtual desktops.
It maintains an empty desktop on the right side while automatically
removing any empty desktops between occupied ones.

This is a fork of the lovely [dynamic_workspaces](https://github.com/maurges/dynamic_workspaces) repo.

## Installation

``` bash
git clone https://github.com/bigimattia/dynamic_workspaces
cd dynamic_workspaces
kpackagetool6 --type KWin/Script --install .
```

### Upgrade

If updating, change the `kpackagetool6` command above to the following:

``` bash
kpackagetool6 --type KWin/Script --upgrade .
```

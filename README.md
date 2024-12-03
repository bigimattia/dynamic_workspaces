# Dynamic Workspaces

A kwin script that creates and deletes desktops.
This is a fork of the lovely [dynamic_workspaces](https://github.com/maurges/dynamic_workspaces) repo.

It's intended to work with Plasma 6.x only and to handle empty desktops in the mid as well.

## Installation

``` bash
git clone https://github.com/bigimattia/dynamic_workspaces
cd dynamic_workspaces
kpackagetool6 --type KWin/Script --install .
```

### Upgrade

If updating, change the `plasmapkg2`/`kpackagetool6` command above to the following:

``` bash
# plasma 6
kpackagetool6 --type KWin/Script --upgrade .
```

## Known issues

When deleting the "last -1" virtual desktop from overview or settings, pager breaks. In order to fix it, exit overview, re-enter and re-delete the "last -1" virtual desktop.

const MIN_DESKTOPS = 2;
const LOG_LEVEL = 2; // 0 trace, 1 debug, 2 info

function log(...args) {
  print("[dynamic_workspaces] ", ...args);
}
function debug(...args) {
  if (LOG_LEVEL <= 1) log(...args);
}
function trace(...args) {
  if (LOG_LEVEL <= 0) log(...args);
}

function createDesktopForClient(client) {
  const lastDesktop = workspace.desktops[workspace.desktops.length - 1];
  if (client.desktops.indexOf(lastDesktop) !== -1) {
    workspace.createDesktop(workspace.desktops.length, undefined);
  }
}

function createLastDesktop() {
  const lastDesktop = workspace.desktops[workspace.desktops.length - 1];
  const client = workspace
    .windowList()
    .find((client) => client.desktops.indexOf(lastDesktop) !== -1);
  if (client) {
    workspace.createDesktop(workspace.desktops.length, undefined);
  }
}

/**
 * Checks for new created or moved windows if they are occupying the last desktop
 * -> if yes, create new one to the right
 */
function onDesktopChangedFor(client) {
  trace(`onDesktopChangedFor(${client.caption})`);
  if (client === null) {
    log("onClientAdded(null) - that may happen rarely");
    return;
  }
  trace(`onClientAdded(${client.caption})`);

  if (client.skipPager) {
    debug("Ignoring added hidden window");
    return;
  }

  createDesktopForClient(client);
}

// tells if desktop has no windows of its own
function isEmptyDesktop(desktop) {
  const cls = workspace.windowList();
  const found = cls.find(
    (client) =>
      client.desktops.indexOf(desktop) !== -1 &&
      !client.skipPager && // ignore hidden windows
      !client.onAllDesktops
  );
  if (found) return false;
  return true;
}

/**
 *  TODO
 *  Simplify logic in order to properly render animations
 * @returns
 */
function removalHandler() {
  const allDesktops = workspace.desktops;
  const desktopsLength = workspace.desktops.length;
  const currentDesktopIndex = allDesktops.indexOf(workspace.currentDesktop);
  console.log("dynamic_workspaces   cDesktop", currentDesktopIndex);

  if (MIN_DESKTOPS >= desktopsLength) return;
  for (const [index, desktop] of workspace.desktops.entries()) {
    if (MIN_DESKTOPS >= workspace.desktops.length) break;
    if (index !== currentDesktopIndex && isEmptyDesktop(desktop) && index < (desktopsLength - 1))
      workspace.removeDesktop(desktop);
  }
}

function redrawDesktops() {
  removalHandler();
  createLastDesktop();
}

function onWindowAdded(client) {
  onDesktopChangedFor(client);
  client.desktopsChanged.connect(createLastDesktop);
}

// Adding or removing a client might create desktops.
// For all existing clients:
workspace.windowList().forEach(onWindowAdded);
// And for all future clients:
workspace.windowAdded.connect(onWindowAdded);
//workspace.windowRemoved.connect(redrawDesktops);

// Switching desktops might remove desktops
workspace.currentDesktopChanged.connect(redrawDesktops);
// worksapce.desktopChanging.connect(redrawDesktops);
// workspace.desktopAdded.connect(redrawDesktops);
// worksapce.desktopRemoved.connect(redrawDesktops);
redrawDesktops();

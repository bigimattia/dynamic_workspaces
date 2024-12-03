/**
 * Minimum number of desktops to maintain.
 */
const MIN_DESKTOPS = 2;

/**
 * Creates a new desktop after the given client if necessary.
 */
function createDesktopForClient(client) {
  const lastDesktop = workspace.desktops[workspace.desktops.length - 1];
  if (client.desktops.indexOf(lastDesktop) !== -1) {
    workspace.createDesktop(workspace.desktops.length, undefined);
  }
}

/**
 * Creates a new desktop at the end if the last desktop is occupied.
 */
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
 * Checks if a new window or a moved window is on the last desktop.
 * If so, a new desktop is created for that window.
 */
function onDesktopChangedFor(client) {
  if (client === null || client.skipPager) {
    return;
  }
  createDesktopForClient(client);
}

/**
 * Checks if a desktop is empty.
 */
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
 * Removes empty desktops, ensuring a minimum number of desktops.
 * Current and last desktops are excluded as well in order to properly render
 * kwin animations between workspace switch
 */
function removalHandler() {
  const allDesktops = workspace.desktops;
  const desktopsLength = workspace.desktops.length;
  const currentDesktopIndex = allDesktops.indexOf(workspace.currentDesktop);
  if (MIN_DESKTOPS >= desktopsLength) return;
  for (const [index, desktop] of workspace.desktops.entries()) {
    if (MIN_DESKTOPS >= workspace.desktops.length) break;
    if (index !== currentDesktopIndex && isEmptyDesktop(desktop) && index < (desktopsLength - 1))
      workspace.removeDesktop(desktop);
  }
}

/**
 * Redraws the desktops by removing empty ones and creating a new one at the
 * end if necessary.
 */
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

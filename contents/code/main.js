/**
 * Minimum number of desktops to maintain.
 */
const MIN_DESKTOPS = 2;

/**
 * Creates a new desktop at the end if the last desktop is occupied.
 */
function addDesktop(window) {
  const lastDesktop = workspace.desktops[workspace.desktops.length - 1];
  if (!window) {
    window = workspace
      .windowList()
      .find((w) => w.desktops.indexOf(lastDesktop) !== -1);
    if (window) {
      workspace.createDesktop(workspace.desktops.length, undefined);
    }
  } else {
    if (window === null || window.skipPager) {
      return;
    }
    if (window.desktops.indexOf(lastDesktop) !== -1) {
      workspace.createDesktop(workspace.desktops.length, undefined);
    }
  }
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
  const desktopsLength = workspace.desktops.length;
  const lastDesktop = workspace.desktops[workspace.desktops.length - 1];
  if (MIN_DESKTOPS >= desktopsLength) return;
  for (const desktop of workspace.desktops) {
    if (MIN_DESKTOPS >= workspace.desktops.length) break;
    if (
      isEmptyDesktop(desktop) &&
      JSON.stringify(lastDesktop) !== JSON.stringify(desktop)
    )
      workspace.removeDesktop(desktop);
  }
}

function removeAllEmptyDesktops() {
  for (const desktop of workspace.desktops) {
    if (isEmptyDesktop(desktop)) workspace.removeDesktop(desktop);
  }
}

/**
 * Redraws the desktops by removing empty ones and creating a new one at the
 * end if necessary.
 */
function redrawDesktops() {
  removalHandler();
  addDesktop();
}


/**
 * SIGNALS
 */
workspace.windowAdded.connect((window) => {
  addDesktop(window);
  window.desktopsChanged.connect(() => addDesktop());
});
workspace.currentDesktopChanged.connect(redrawDesktops);

/**
 * MAIN
 */
workspace
  .windowList()
  .forEach((window) => {
    window.desktopsChanged.connect(() => addDesktop()); // bind to existing windows
  });
// remove all + add desktop at the end
removeAllEmptyDesktops();
workspace.createDesktop(workspace.desktops.length, undefined);


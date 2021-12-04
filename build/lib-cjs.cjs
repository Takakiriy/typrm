const fs = require('fs');
const path = require('path');
const projectPath = path.dirname(__dirname);
const snapshotsPath = `${projectPath}/src/__snapshots__/main.test.ts.snap`;

var snapshots = undefined;
if (fs.existsSync(snapshotsPath)) {
    snapshots = require(snapshotsPath);
}
exports.snapshots = snapshots;

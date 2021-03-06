"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFiles = exports.getDirectories = exports.isDirectory = exports.filterAsync = exports.mapAsync = void 0;
const fs = require("fs");
const path = require("path");
const util_1 = require("util");
const readdir = util_1.promisify(fs.readdir);
const lstat = util_1.promisify(fs.lstat);
const exists = util_1.promisify(fs.exists);
function mapAsync(array, callbackfn) {
    return Promise.all(array.map(callbackfn));
}
exports.mapAsync = mapAsync;
async function filterAsync(array, callbackfn) {
    const filterMap = await mapAsync(array, callbackfn);
    return array.filter((value, index) => filterMap[index]);
}
exports.filterAsync = filterAsync;
exports.isDirectory = async (source) => (await lstat(source)).isDirectory();
exports.getDirectories = async (source) => {
    const dirs = await readdir(source);
    return filterAsync(dirs.map(name => path.join(source, name)), exports.isDirectory);
};
exports.getFiles = async (dirPath, pattern) => {
    const dirs = await readdir(dirPath, { withFileTypes: true });
    return (await filterAsync(dirs, async (f) => {
        try {
            if (typeof f === 'string') {
                return (await exists(path.join(dirPath, f))) && pattern.test(f);
            }
            else {
                return f.isFile() && pattern.test(f.name);
            }
        }
        catch (_a) {
            return false;
        }
    })).map(f => path.join(dirPath, typeof f === 'string' ? f : f.name));
};
//# sourceMappingURL=file.js.map
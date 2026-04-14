import * as fsAsync from 'fs/promises';
import fs from 'fs';
import path from 'path'
import os from 'os';

const dirs = new Map();

/**
 * 
 * @param {BigInt} index
 * @returns {path} 
 */
export function getTempDir(index) {
    let v;
    if (v = dirs.get(index)) {
        return v;
    }
    v = fs.mkdtempSync(path.join(os.tmpdir(), "safeJS-"));
    dirs.set(index, v);
    return v;
}

/**
 * 
 * @param {BigInt} index
 * @returns {void} 
 */
export function rmTempDir(index) {
    if (!dirs.get(index)) {
        throw new Object.defineProperties(new Error("(INTERNAL) ENOENT: Attempted to delete temporary directory that doesn't exist."), {
            code: { value: 'ENOENT', enumerable: true },
            index: { value: index, enumerable: true },
            syscall: { value: 'rmTempDir', enumerable: true }
        });
    }
    const path = dirs.get(index);
    dirs.delete(index);
    fsAsync.rm(path, {recursive: true, force: true});
}

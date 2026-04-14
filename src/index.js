#!/usr/bin/env node

import ivm from 'isolated-vm';
import * as fs from 'fs';
import os from 'os';
import path from 'path'

import _mkprompt from 'prompt-sync';
const prompt = _mkprompt();

let perms = [];

const isolate = new ivm.Isolate({ memoryLimit: 512 });
const context = await isolate.createContext();

const jail = context.global;
await jail.set('global', jail.derefInto());

await jail.set(
    '__internal_consoleLog',
    new ivm.Reference((level, msg) => {
        if (!perms.find(e => e === "console")) {
            console.error("Missing permission: 'console'.\n");
            isolate.dispose();
            console.info(`Exited with error code 1.`);
            exit(1);
        }
        if (level === 0) {
            process.stdout.write(`[INFO]  ${msg}\n`);
        } else if (level === 1) {
            process.stderr.write(`[ERROR] ${msg}\n`);
        }
    })
);

await jail.set(
    '__internal_getInput',
    new ivm.Reference((msg) => {
        if (!(perms.includes("console") && perms.includes("interactive"))) {
            console.error(`Missing permission: '${perms.includes("console") ? 'interactive' : 'console'}'.\n`);
            isolate.dispose();
            console.info(`Exited with error code 1.`);
            exit(1);
        }

        const p = prompt(`(Prompt) ${msg}: `);
        return p;
    })
)

await context.eval(`
    globalThis.console = {
        info: (msg) => __internal_consoleLog.apply(undefined, [0, msg]),
        error: (msg) => __internal_consoleLog.apply(undefined, [1, msg]),
        input: (prompt) => __internal_getInput.applySync(undefined, [prompt])
    }
`);

import * as tar from 'tar';
import Seven from 'node-7z';
import { getTempDir, rmTempDir } from './tempdir.js';
import { exit } from 'process';

const tmpDir = getTempDir(1n);

await tar.x({
    file: process.argv[2],
    cwd: tmpDir,
    gzip: process.argv[2].endsWith(".gz"),
    strip: 2
});

let code;
let manifest;

try {
    code = fs.readFileSync(path.join(getTempDir(1n), "index.js"), "utf-16le");
    manifest = JSON.parse(fs.readFileSync(path.join(getTempDir(1n), "manifest.json")));
} finally {
    rmTempDir(1n);
}

perms = manifest.permissions || [];

try {
    await context.eval(code, { timeout: 5000 });
    console.info(`Exited with error code 0.`);
} catch (e) {
    console.error(`[CRITICAL] ${e}`);
    console.info(`Exited with error code 1.`);
}

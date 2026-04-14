#!/usr/bin/env node

import ivm from 'isolated-vm';

const isolate = new ivm.Isolate({ memoryLimit: 512 });
const context = await isolate.createContext();

const jail = context.global;
await jail.set('global', jail.derefInto());

await jail.set(
    '__internal_consoleLog',
    new ivm.Reference((level, msg) => {
        if (level === 0) {
            process.stdout.write(`[INFO]  ${msg}\n`);
        } else if (level === 1) {
            process.stderr.write(`[ERROR] ${msg}\n`);
        }
    })
);

await context.eval(`
    globalThis.console = {
        info: (msg) => __internal_consoleLog.apply(undefined, [0, msg]),
        error: (msg) => __internal_consoleLog.apply(undefined, [1, msg])
    }
`);

import * as fs from 'fs';

const code = fs.readFileSync(process.argv[2], "utf-16le");

await context.eval(code);

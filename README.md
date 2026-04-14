# SafeJS — A runtime designed for safety
SafeJS is a javascript runtime based on Node.js, designed for safe execution of untrusted code/scripts.

## How does it work?
SafeJS uses isolated-vm under the hood to virtualise javascript scripts and provide a customised API.

## API
### console
| API | Arguments | Description |
| --- | --------- | ----------- |
| `console.info` | `msg: string` | Output an INFO log |
| `console.error` | `msg: string` | Output an ERROR log |

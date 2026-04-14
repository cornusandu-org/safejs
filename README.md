# SafeJS — A runtime designed for safety
SafeJS is a javascript runtime based on Node.js, designed for safe execution of untrusted code/scripts.

## How does it work?
SafeJS uses isolated-vm under the hood to virtualise javascript scripts and provide a customised API.

## How to use?

### Making a SafeJS project

You must make a tarfile of the following structure:
```
/
|- index.js
|- manifest.json
```

The `index.js` file must be self-contained (no require, no imports, no dynamic imports).

The `manifest.json` file must contain the following fields:
| Field | Type |
| ----- | ---- |
| `permissions` | Required |

## API
### console
| API | Arguments | Required Permissions | Description |
| --- | --------- | -------------------- | ----------- |
| `console.info` | `msg: string` | `console` | Output an INFO log |
| `console.error` | `msg: string` | `console` | Output an ERROR log |
| `console.input` | `prompt: string` | `console`, `interactive` | Read from keyboard until newline |

## More Info
| Restriction  | Value |
| ------------ | ----- |
| Memory Limit | 512MB |
| Timeout      | 5 seconds |

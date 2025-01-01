/// <reference types="vite/client" />

declare module 'crossoriginworker';

declare module "*.wasm" {
    const wasmBuilderFunc: (imports?: WebAssembly.Imports) => Promise<{ instance: WebAssembly.Instance & { exports: T } }>;
    export default wasmBuilderFunc;
}
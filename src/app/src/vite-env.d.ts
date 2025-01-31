/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

declare module 'crossoriginworker';

declare module "*.wasm" {
    const wasmBuilderFunc: (imports?: WebAssembly.Imports) => Promise<{ instance: WebAssembly.Instance & { exports: T } }>;
    export default wasmBuilderFunc;
}
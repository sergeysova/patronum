const path = require('path');
const { terser } = require('rollup-plugin-terser');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');

const plugins = [
  nodeResolve({ extensions: ['.js'] }),
  commonjs({ extensions: ['.js'] }),
  terser({}),
];

const input = 'index.js';

// eslint-disable-next-line import/no-anonymous-default-export
export default [
  {
    input,
    external: ['effector'],
    plugins,
    output: {
      file: 'patronum.cjs.js',
      format: 'cjs',
      freeze: false,
      exports: 'named',
      sourcemap: true,
      externalLiveBindings: false,
    },
  },
  {
    input,
    external: ['effector'],
    plugins,
    output: {
      name: 'patronum',
      file: 'patronum.umd.js',
      format: 'umd',
      exports: 'named',
      sourcemap: true,
      freeze: false,
      globals: {
        effector: 'effector',
      },
    },
  },
];

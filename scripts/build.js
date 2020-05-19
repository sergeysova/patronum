/* eslint-disable unicorn/no-process-exit, prefer-template */
const fs = require('fs');
const { promisify } = require('util');
const globby = require('globby');
const { camelCase } = require('camel-case');

const rollup = require('rollup');
const pluginCommonJs = require('@rollup/plugin-commonjs');
const pluginNodeResolve = require('@rollup/plugin-node-resolve');
const pluginTerser = require('rollup-plugin-terser');

const Package = require('../package.json');

const rmdir = promisify(fs.rmdir);
const mkdir = promisify(fs.mkdir);
const writeFile = promisify(fs.writeFile);
const copyFile = promisify(fs.copyFile);

async function main() {
  const methods = await resolveMethods();

  const directory = `./dist-package`;
  await rmdir(directory, { recursive: true });
  await mkdir(directory, { recursive: true });

  await Promise.all([
    createCommonJs(directory, methods),
    // createEsModule(directory, methods),
    createTypingIndex(directory, methods),
    createRootPackage(directory, methods),
    ...methods.map(compileMethod(directory)),
  ]);

  await bundleUmdRoot(directory);
}

async function resolveMethods() {
  // Each package contains that file
  const packageMarker = 'index.d.ts';

  const found = await globby(`./src/*/${packageMarker}`);
  return found.map((name) =>
    name.replace(`/${packageMarker}`, '').replace('./src/', ''),
  );
}

async function createCommonJs(directory, files) {
  const requires = files.sort().map((name) => {
    const camel = camelCase(name);
    return `module.exports.${camel} = require('./${name}').${camel};`;
  });

  await writeFile(`${directory}/index.js`, requires.join('\n') + '\n');
}

async function createEsModule(directory, files) {
  const imports = files.sort().map((name) => {
    const camel = camelCase(name);
    return `export { ${camel} } from './${name}/index.mjs';`;
  });

  await writeFile(`${directory}/index.mjs`, imports.join('\n') + '\n');
}

async function createTypingIndex(directory, files) {
  const types = files
    .sort()
    .map((name) => `export { ${camelCase(name)} } from './${name}';`);

  await writeFile(`${directory}/index.d.ts`, types.join('\n') + '\n');
}

async function createRootPackage(directory, files) {
  const created = {
    name: process.env.UNSCOPED ? Package.name : `@patronum/all`,
    version: process.env.UNSCOPED
      ? Package.version
      : `${Package.version}-${Date.now()}`,
    description: Package.description,
    repository: Package.repository,
    keywords: Package.keywords,
    author: Package.author,
    license: Package.license,
    bugs: Package.bugs,
    homepage: Package.homepage,
    peerDependencies: Package.peerDependencies,
    dependencies: Package.dependencies,
    publishConfig: {
      access: 'public',
    },

    main: './index.js',
    typings: './index.d.ts',
    // module: './index.mjs',
    // 'jsNext:main': './index.mjs',
    sideEffects: false,
    files: fieldFiles(files),
    browser: fieldBrowser(files),
    // exports: fieldExports(files),
  };

  await writeFile(
    `${directory}/package.json`,
    JSON.stringify(created, null, 2),
  );
}

function fieldBrowser(files) {
  const object = {};

  files.forEach((name) => {
    object[`./${name}.js`] = `./${name}/index.js`;
    object[`./${name}`] = `./${name}/index.js`;
    object[name] = `./${name}/index.js`;
  });

  return object;
}

function fieldExports(files) {
  const object = {
    '.': {
      browser: './index.js',
      node: {
        import: './index.mjs',
        require: './index.js',
      },
    },
  };

  files.forEach((name) => {
    object[`./${name}`] = {
      browser: `./${name}/index.js`,
      node: {
        import: `./${name}/index.mjs`,
        require: `./${name}/index.js`,
      },
    };
  });

  return object;
}

function fieldFiles(files) {
  return []
    .concat(['index.js', 'index.d.ts', /* 'index.mjs', */ 'dist/index.js'])
    .concat(
      ...files.map((name) => [`${name}/index.js` /* `${name}/index.mjs` */]),
    );
}

function compileMethod(directory) {
  return async (name) => {
    const source = `src/${name}`;
    const target = `${directory}/${name}`;

    await mkdir(target, { recursive: true });
    await copyFiles(source, target, [/* 'index.mjs', */ 'index.d.ts']);

    await bundleMethod({
      source: `${source}/index.mjs`,
      target: `${target}/index.js`,
      name,
    });
  };
}

function copyFiles(source, destination, files) {
  return Promise.all(
    files.map((file) =>
      copyFile(`${source}/${file}`, `${destination}/${file}`),
    ),
  );
}

async function bundleMethod({ source, target, name }) {
  const input = {
    input: source,
    plugins: [pluginCommonJs(), pluginNodeResolve()],
    external: [].concat(
      Object.keys(Package.peerDependencies),
      Object.keys(Package.dependencies),
    ),
  };
  const output = {
    file: target,
    format: 'cjs',
    name,
    exports: 'named',
  };

  const bundle = await rollup.rollup(input);
  await bundle.generate(output);
  await bundle.write(output);
}

const compatNameCache = {};

async function bundleUmdRoot(directory) {
  const plugins = [
    pluginCommonJs({
      exclude: ['node_modules/symbol-observable/es/*.js'],
    }),
    pluginNodeResolve(),
    pluginTerser.terser({
      parse: {
        ecma: 5,
      },
      compress: {
        directives: false,
        ecma: 5,
      },
      mangle: {
        safari10: true,
      },
      output: {
        ecma: 5,
        safari10: true,
        webkit: true,
      },
      ecma: 5,
      nameCache: compatNameCache,
      safari10: true,
    }),
  ];
  const input = {
    input: `${directory}/index.js`,
    plugins,
    external: [].concat(Object.keys(Package.peerDependencies)),
  };
  const output = {
    file: `${directory}/dist/index.js`,
    format: 'cjs',
    name: Package.name,
    exports: 'named',
  };

  const bundle = await rollup.rollup(input);
  await bundle.generate(output);
  await bundle.write(output);
}

main().catch((error) => {
  // eslint-disable-next-line no-console
  console.error(error);
  process.exit(-1);
});

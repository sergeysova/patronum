/* eslint-disable unicorn/no-process-exit, prefer-template */
const fs = require('fs');
const { promisify } = require('util');
const globby = require('globby');
const { camelCase } = require('camel-case');

const writeFile = promisify(fs.writeFile);

const packageMarker = 'index.d.ts';

async function main() {
  const found = await globby(`./src/*/${packageMarker}`);

  const names = found.map((name) =>
    name.replace(`/${packageMarker}`, '').replace('./src/', ''),
  );

  await createIndex(names);
  await createTypings(names);
  await createPresetPlugins(names.filter((method) => method !== 'debug'));
}

async function createIndex(names) {
  const imports = names.sort().map((name) => {
    const camel = camelCase(name);
    return `module.exports.${camel} = require('./src/${name}').${camel};`;
  });

  await writeFile('./index.js', imports.join('\n') + '\n');
}

async function createTypings(names) {
  const types = names
    .sort()
    .map((name) => `export { ${camelCase(name)} } from './src/${name}';`);

  await writeFile('./index.d.ts', types.join('\n') + '\n');
}

async function createPresetPlugins(names) {
  const patronum = [
    'effector/babel-plugin',
    {
      importName: 'patronum',
      attachCreators: names.sort().map(camelCase),
      noDefaults: true,
    },
    'patronum',
  ];

  const methods = names.sort().map((method) => [
    'effector/babel-plugin',
    {
      importName: `patronum/${method}`,
      attachCreators: [camelCase(method)],
      noDefaults: true,
    },
    `patronum/${method}`,
  ]);

  const plugins = [patronum, ...methods];

  await writeFile(
    './babel-preset-plugins.json',
    JSON.stringify(plugins, null, 2),
  );
}

main().catch((error) => {
  // eslint-disable-next-line no-console
  console.error(error);
  process.exit(-1);
});

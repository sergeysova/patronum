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
    name.replace('./src/', '').replace(`/${packageMarker}`, ''),
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
  const methods = names.sort().map((method) => `patronum/${method}`);

  const factories = ['patronum', ...methods];

  const mapping = Object.fromEntries(names.map((name) => [camelCase(name), name]));

  await writeFile(
    './babel-plugin-factories.json',
    JSON.stringify({ factories, mapping }, null, 2),
  );
}

main().catch((error) => {
  // eslint-disable-next-line no-console
  console.error(error);
  process.exit(-1);
});

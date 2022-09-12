#!/usr/bin/env node
// @flow
const yargs = require('yargs');
const { hideBin } = require('yargs/helpers');

const main = require('../src');

const argv = yargs(hideBin(process.argv)).argv;
const [
  dep,
  _from,
  _to,
] = argv._;

main(dep, _from, _to);

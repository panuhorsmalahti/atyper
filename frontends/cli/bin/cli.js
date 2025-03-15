#!/usr/bin/env node

const path = require('path');
const { execSync } = require('child_process');

// Resolve the path to the CLI entry point in the dist folder
const cliPath = path.resolve(__dirname, '../dist/cli/cli.js');

// Execute the CLI script
require(cliPath);

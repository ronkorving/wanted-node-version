'use strict';

const pathJoin = require('path').join;
const readFileSync = require('fs').readFileSync;

function safeReadText(srcPath) {
	try {
		return readFileSync(srcPath, { encoding: 'utf8' }).trim();
	} catch (error) {
		if (error.code === 'ENOENT') {
			return undefined;
		}

		throw error;
	}
}

function getEnginesNode(pkgPath) {
	const pkg = require(pkgPath);
	if (pkg.engines && pkg.engines.node) {
		return pkg.engines.node;
	}

	return undefined;
}

function areAllValuesEqual(obj) {
	let foundValue;

	for (const key in obj) {
		if (obj.hasOwnProperty(key)) {
			const value = obj[key];

			if (foundValue === undefined) {
				foundValue = value;
			} else if (value !== foundValue) {
				return false;
			}
		}
	}

	return true;
}

/**
 * Returns the allowed Node version ranges according to various sources (which may disagree with each other)
 *
 * @param {string} srcPath  The path of the project we want to inspect
 * @returns {Object}        { sources, version, conflict }
 */
module.exports = function (srcPath) {
	const nvmrc = safeReadText(pathJoin(srcPath, '.nvmrc'));
	const nodeVersion = safeReadText(pathJoin(srcPath, '.node-version'));
	const enginesNode = getEnginesNode(pathJoin(srcPath, 'package.json'));

	const sources = {};

	if (nvmrc) {
		sources['.nvmrc'] = nvmrc;
	}

	if (nodeVersion) {
		sources['.node-version'] = nodeVersion;
	}

	if (enginesNode) {
		sources['engines.node'] = enginesNode;
	}

	return {
		sources,
		version: sources['.nvmrc'] || sources['.node-version'] || sources['engines.node'],
		conflict: !areAllValuesEqual(sources)
	};
};

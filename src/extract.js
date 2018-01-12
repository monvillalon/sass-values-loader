const path = require('path')
const sass = require('node-sass')

const convertSassValue = require('./convertSassValue')
const transformSassFile = require('./transformSassFile')



function exportSassValue (vars, name, value) {
	const n = convertSassValue(name)
	const v = convertSassValue(value)

	if (n !== undefined || v !== undefined) {

		// eslint-disable-next-line no-param-reassign
		vars[n] = v

	}

	return value
}

function importSassFile (start, deps, url, prev) {
	const prevDir = path.dirname(prev === 'stdin' ? start : prev)
	const file = path.resolve(prevDir, url)

	deps.push(file)

	return {
		file
	}
}

function parseSass (data, importer, functions) {
	return new Promise((resolve, reject) => {
		sass.render({
			data,
			importer,
			functions
		}, (err, result) => {
			if (err) {
				reject(err)
				return
			}
			resolve()
		})
	})
}



module.exports = function (file, sassData) {
	const variables = {}
	const dependencies = []

	try {
		const transformedSass = transformSassFile(sassData)

		const importer = (url, prev, done) => {
			return importSassFile(file, dependencies, url, prev)
		}

		const exportVarCallback = (name, value) => {
			return exportSassValue(variables, name, value)
		}

		const functions = {
			'export_var': exportVarCallback
		}

		return parseSass(transformedSass, importer, functions)
			.then(() => {
				return {
					variables,
					dependencies
				}
			})

	} catch (e) {
		return Promise.reject(e)
	}

}


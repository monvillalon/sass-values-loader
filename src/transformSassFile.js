const scssParser = require('scss-parser')
const createQueryWrapper = require('query-ast')
const isArray = require('lodash.isarray')

function cleanAST (ast) {
	if (isArray(ast)) {
		return ast.map(ast, cleanAST)
	}
	return {
		type: ast.type,
		value: ast.value
	}
}

module.exports = function (data) {
	const ast = scssParser.parse(data)
	const $ = createQueryWrapper(ast)

	$().children('declaration').replace((declaration) => {
		const $declaration = $(declaration)
		const $property = $declaration.children('property').first()
		const $variable = $property.children('variable').first()

		$declaration.children('value').first().replace((v) => {
			const variableName = $variable.value()
			const valueAST = cleanAST($(v).get(0))

			const newArguments = []
			newArguments.push({ type: 'string_double', value: variableName })
			newArguments.push({ type: 'punctuation', value: ',' })
			newArguments.push(valueAST)

			return {
				type: 'function',
				value: [
					{ type: 'identifier', value: 'export_var' },
					{ type: 'arguments', value: newArguments }
				]
			}
		})
		return declaration
	})

	return scssParser.stringify($().get(0))
}

const sass = require('node-sass')



// Standardise number
function convertNumberValue (v) {
	return v.getValue()
}

// Standardise string
function convertStringValue (v) {
	return v.getValue()
}

// Standardise color value: always return rgba or rgb string
function convertColorValue (v) {
	if (v.getA() === 1) {
		return 'rgb(' + v.getR() + ', ' + v.getG() + ', ' + v.getB() + ')'
	}
	return 'rgba(' + v.getR() + ', ' + v.getG() + ', ' + v.getB() + ', ' + v.getA() + ')'
}

// Standardise list value
function convertListValue (v) {
	const list = []
	for (let i = 0; i < v.getLength(); i += 1) {
		list.push(convertSassValue(v.getValue(i)))
	}
	return list
}

// Standardise map value
function convertMapValue (v) {
	const map = {}
	for (let i = 0; i < v.getLength(); i += 1) {
		const key = v.getKey(i).getValue()
		const value = convertSassValue(v.getValue(i))
		map[key] = value
	}
	return map
}



function convertSassValue (v) {
	if (v instanceof sass.types.Boolean) {
		return v.getValue()
	}

	// Standardise color values
	if (v instanceof sass.types.Color) {
		return convertColorValue(v)
	}

	// Standardise list values
	if (v instanceof sass.types.List) {
		return convertListValue(v)
	}

	if (v instanceof sass.types.Map) {
		return convertMapValue(v)
	}

	if (v instanceof sass.types.Number) {
		return convertNumberValue(v)
	}

	if (v instanceof sass.types.Null) {
		return null
	}

	if (v instanceof sass.types.String) {
		return convertStringValue(v)
	}

	return undefined
}



module.exports = convertSassValue

const sass = require('node-sass')
const convertSassValue = require('../src/convertSassValue')

describe('number', () => {

	test('becomes number', () => {
		expect(convertSassValue(
			new sass.types.Number(10)
		)).toBe(10)
	})

	test('px becomes number', () => {
		expect(convertSassValue(
			new sass.types.Number(10, 'px')
		)).toBe(10)
	})

	test('pt becomes number', () => {
		expect(convertSassValue(
			new sass.types.Number(10, 'pt')
		)).toBe(10)
	})

	test('pc becomes number', () => {
		expect(convertSassValue(
			new sass.types.Number(10, 'pc')
		)).toBe(10)
	})

	test('em becomes number', () => {
		expect(convertSassValue(
			new sass.types.Number(10, 'em')
		)).toBe(10)
	})

	test('rem becomes number', () => {
		expect(convertSassValue(
			new sass.types.Number(10, 'rem')
		)).toBe(10)
	})

	test('% becomes number', () => {
		expect(convertSassValue(
			new sass.types.Number(10, '%')
		)).toBe(10)
	})

	test('cm becomes number', () => {
		expect(convertSassValue(
			new sass.types.Number(10, 'cm')
		)).toBe(10)
	})

	test('deg becomes number', () => {
		expect(convertSassValue(
			new sass.types.Number(10, 'deg')
		)).toBe(10)
	})

	test('rad becomes number', () => {
		expect(convertSassValue(
			new sass.types.Number(10, 'rad')
		)).toBe(10)
	})

	test('ms becomes number', () => {
		expect(convertSassValue(
			new sass.types.Number(10, 'ms')
		)).toBe(10)
	})

	test('dpi becomes number', () => {
		expect(convertSassValue(
			new sass.types.Number(10, 'dpi')
		)).toBe(10)
	})

	// FIXME: this should expect 10000
	test('s becomes number', () => {
		expect(convertSassValue(
			new sass.types.Number(10, 's')
		)).toBe(10)
	})

})



test('string becomes string', () => {
	expect(convertSassValue(
		new sass.types.String('foo')
	)).toBe('foo')
})



describe('color', () => {

	test('without alpha becomes rgb', () => {
		expect(convertSassValue(
			new sass.types.Color(0, 0, 0, 1)
		)).toBe('rgb(0, 0, 0)')
	})

	test('with alpha becomes rgba', () => {
		expect(convertSassValue(
			new sass.types.Color(0, 0, 0, 0.5)
		)).toBe('rgba(0, 0, 0, 0.5)')
	})

})



describe('singleton', () => {

	test('null becomes null', () => {
		expect(convertSassValue(
			sass.types.Null.NULL
		)).toBe(null)
	})

	test('true becomes true', () => {
		expect(convertSassValue(
			sass.types.Boolean.TRUE
		)).toBe(true)
	})

	test('false becomes false', () => {
		expect(convertSassValue(
			sass.types.Boolean.FALSE
		)).toBe(false)
	})

})



describe('list', () => {

	test('becomes empty array', () => {
		const list = new sass.types.List()
		expect(convertSassValue(list)).toEqual([])
	})

	test('becomes array with values', () => {
		let list = new sass.types.List(3)

		list.setValue(0, sass.types.Boolean.TRUE)
		list.setValue(1, new sass.types.String('foo'))
		list.setValue(2, new sass.types.Number(10))

		expect(convertSassValue(list)).toEqual([
			true,
			'foo',
			10
		])
	})

})



describe('map', () => {

	test('becomes empty object', () => {
		const list = new sass.types.Map()
		expect(convertSassValue(list)).toEqual({})
	})

	test('becomes object with key-value pairs', () => {
		let map = new sass.types.Map(3)

		map.setKey(0, new sass.types.String('one'))
		map.setKey(1, new sass.types.String('two'))
		map.setKey(2, new sass.types.String('three'))

		map.setValue(0, sass.types.Boolean.TRUE)
		map.setValue(1, new sass.types.String('foo'))
		map.setValue(2, new sass.types.Number(10))

		expect(convertSassValue(map)).toEqual({
			one: true,
			two: 'foo',
			three: 10
		})
	})

})

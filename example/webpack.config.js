const path = require('path')
// const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const WebpackCleanupPlugin = require('webpack-cleanup-plugin')

module.exports = {
	entry: {
		js: path.join(__dirname, '/index.js')
	},
	output: {
		path: path.join(__dirname, '/dist/'),
		filename: 'index.js'
	},
	resolveLoader: {
		alias: {
			'vars': 'sass-values-loader'
		},
		modules: ['node_modules', './']
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: [/node_modules/],
				use: {
					loader: 'babel-loader'
				}
			},
			{
				test: /\.scss$/,
				use: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: [
						'css-loader?importLoaders=1&modules&localIdentName=[path]___[name]__[local]___[hash:base64:5]',
						'sass-loader'
					]
				})
			}
		]
	},
	plugins: [
		new ExtractTextPlugin('style.css'),
		new WebpackCleanupPlugin()
	]
}

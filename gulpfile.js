/* ─────────────╮
 │ gulp/cordial │
 ╰──────────────┴────────────────────────────────────────────────────────────── */
const gulp = require('gulp')
const rename = require('gulp-rename')
const chmod = require('gulp-chmod')
const rollup = require('gulp-better-rollup')
const babel = require('rollup-plugin-babel')
const lodash = require('babel-plugin-lodash')

const external = [
	'@thebespokepixel/meta',
	'@thebespokepixel/string',
	'common-tags',
	'fs',
	'lodash/defaultsDeep',
	'lodash/flatten',
	'lodash/forIn',
	'lodash/isObject',
	'lodash/map',
	'lodash/template',
	'lodash/upperFirst',
	'path',
	'pkg-conf',
	'read-pkg-up',
	'remark',
	'remark-heading-gap',
	'remark-squeeze-paragraphs',
	'trucolor',
	'truwrap',
	'unist-builder',
	'update-notifier',
	'urlencode',
	'verbosity',
	'yargs'
]

const babelConfig = {
	plugins: [lodash],
	presets: [
		['@babel/preset-env', {
			modules: false,
			targets: {
				node: '8.0.0'
			}
		}]
	],
	comments: false,
	exclude: 'node_modules/**'
}

gulp.task('cjs', () =>
	gulp.src('src/main.js')
		.pipe(rollup({
			external,
			plugins: [babel(babelConfig)]
		}, {
			format: 'cjs'
		}))
		.pipe(rename('index.js'))
		.pipe(gulp.dest('.'))
)

gulp.task('es6', () =>
	gulp.src('src/main.js')
		.pipe(rollup({
			external,
			plugins: [babel(babelConfig)]
		}, {
			format: 'es'
		}))
		.pipe(rename('index.mjs'))
		.pipe(gulp.dest('.'))
)

gulp.task('cli', () =>
	gulp.src('src/cli.js')
		.pipe(rollup({
			external,
			plugins: [babel(babelConfig)]
		}, {
			banner: '#! /usr/bin/env node',
			format: 'cjs'
		}))
		.pipe(rename('compile-readme'))
		.pipe(chmod(0o755))
		.pipe(gulp.dest('bin'))
)

gulp.task('default', gulp.series('cjs', 'es6', 'cli'))

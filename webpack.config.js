const path = require('path');

let babelOptions;
let filename = '[name].js';
const minify = process.env.BUILD_MODE.endsWith('min');

if (!process.env.BUILD_MODE.startsWith('umd')) {
  // To see es* prefix in webpack stat output, concatenate folder with filename
  filename = `${process.env.BUILD_MODE.match(/^([^-]+)/)[1]}/${filename}`;
}

if (process.env.BUILD_MODE.startsWith('umd')) {
  babelOptions = {
    presets: [
      'react',
      'env',
    ],
    plugins: [
      'transform-class-properties',
      'transform-object-rest-spread',
      ['transform-react-remove-prop-types', {mode: 'remove'}],
    ],
  };
} else if (process.env.BUILD_MODE.startsWith('es2015')) {
  babelOptions = {
    plugins: [
      ['transform-react-jsx', {useBuiltIns: true}],
      'syntax-jsx',

      'transform-async-to-generator',

      'transform-class-properties',
      ['transform-object-rest-spread', {useBuiltIns: true}],
      ['transform-react-remove-prop-types', {mode: 'remove'}],
    ],
  };
} else if (process.env.BUILD_MODE.startsWith('es2017')) {
  babelOptions = {
    plugins: [
      ['transform-react-jsx', {useBuiltIns: true}],
      'syntax-jsx',

      'transform-class-properties',
      ['transform-object-rest-spread', {useBuiltIns: true}],
      ['transform-react-remove-prop-types', {mode: 'remove'}],
    ],
  };
}

module.exports = {
  entry: {
    [`react-forwardref-utils${minify ? '.min' : ''}`]: './src/index.js',
  },
  output: {
    filename,
    sourceMapFilename: `${filename}.map`,
    path: path.resolve(__dirname, 'dist'),
    pathinfo: false,
    libraryTarget: 'umd',
    library: 'SizeWatcher',
  },
  devtool: 'source-map',
  mode: 'production',
  optimization: {
    removeAvailableModules: true,
    removeEmptyChunks: true,
    mergeDuplicateChunks: true,
    flagIncludedChunks: true,
    occurrenceOrder: true,
    providedExports: true,
    usedExports: true,
    sideEffects: true,
    concatenateModules: true,
    splitChunks: false,
    runtimeChunk: false,
    noEmitOnErrors: true,
    namedModules: true,
    namedChunks: true,
    nodeEnv: 'production',
    minimize: minify,
  },
  resolve: {
    modules: [
      path.resolve('src'),
      'node_modules',
    ],
  },
  externals: {
    'react': 'umd react',
    'hoist-non-react-statics': {
      amd: 'hoist-non-react-statics',
      root: 'hoistNonReactStatics',
      commonjs: 'hoist-non-react-statics',
      commonjs2: 'hoist-non-react-statics',
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: babelOptions,
        },
      },
    ],
  },
  node: {
    process: false,
    setImmediate: false,
  },
  stats: {
    assets: true,
    colors: true,
    errors: true,
    errorDetails: true,
    hash: false,
    timings: true,
    version: true,
    warnings: true,
    entrypoints: false,
    modules: false,
  },
};
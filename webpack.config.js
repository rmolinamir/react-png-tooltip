const path = require('path')
const autoprefixer = require('autoprefixer')

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'index.js',
    libraryTarget: 'commonjs2'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    alias: {
      react: require.resolve('react')
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: ['@babel/transform-runtime']
          }
        }
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          { loader: 'style-loader' },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: true,
              localIdentName: '[name]__[local]__[hash:base64:5]'
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              indent: 'postcss',
              plugins: () => [
                autoprefixer({
                  browsers: [
                    '> 1%',
                    'last 2 versions'
                  ]
                })
              ]
            }
          }
        ]
      },
      {
        test: /\.(png|jpe?g|gif)$/,
        loader: 'url-loader?limit=8000&name=images/[name].[ext]'
      }
    ]
  },
  // This line is just to use the React dependency of our parent-testing-project instead of using our own React.
  externals: {
    'react': 'commonjs react'
  },
  stats: {
    colors: true,
    errors: true,
    errorDetails: true,
    hash: false,
    version: false,
    timings: false,
    assets: false,
    chunks: false,
    chunkModules: false,
    chunkOrigins: false,
    chunkGroups: false,
    modules: false,
    reasons: false,
    moduleTrace: false,
    children: false,
    source: false,
    warnings: false,
    publicPath: false
  }
}

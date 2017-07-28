const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  entry: './src/app.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: isProd ? './dist/' : '/dist/',
    filename: isProd ? 'build.[hash:4].js' : 'build.js',
    chunkFilename: "[name].[hash:4].min.js"
  },
  module: {
    noParse: /es6-promise\.js$/, // avoid webpack shimming process
    rules: [{
      test: /\.vue$/,
      loader: 'vue',
      options: {
        extractCSS: isProd,
        preserveWhitespace: false,
        postcss: [
          require('precss')(),
          require('autoprefixer')()
        ]
      }
    }, {
      test: /\.js$/,
      loader: 'babel',
      exclude: /node_modules/
    }, {
      test: /\.css$/,
      use: isProd ? ExtractTextPlugin.extract({
          use: 'css-loader?minimize',
          fallback: 'vue-style-loader'
        }) : ['vue-style-loader', 'css-loader']
        // loader: 'style!css'
    }, {
      test: /\.(less)$/,
      use: [
        'style-loader', {
          loader: 'css-loader',
          options: {
            importLoaders: 1
          }
        }, {
          loader: 'postcss-loader',
          options: {
            plugins: function() {
              return [
                require('precss'),
                require('autoprefixer')
              ];
            }
          }
        },
        'less-loader'
      ]
    }, {
      test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
      loader: 'url',
      query: {
        limit: 10000,
      }
    }, {
      test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
      loader: 'url',
      query: {
        limit: 10000,
      }
    }]
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue'
    }
  },
  devServer: {
    historyApiFallback: true,
    noInfo: true
  },
  resolveLoader: {
    moduleExtensions: ['-loader']
  },
  performance: {
    hints: isProd ? 'warning' : false
  },
  devtool: isProd ? false : '#cheap-module-source-map',
}

if (isProd) {
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        drop_debugger: true,
        drop_console: true
      },
      sourceMap: true
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    }),
    new HtmlWebpackPlugin({
      filename: '../index.html',
      template: path.resolve(__dirname, './src/index.tpl'),
      inject: true
    }),
    new ExtractTextPlugin({
      filename: 'common.[chunkhash].css'
    }),
    new FriendlyErrorsPlugin(),
    new webpack.optimize.ModuleConcatenationPlugin()
  ])
}
const path = require('path')
const base = path.join(__dirname, '..')
const ExtractTextPlugin = require('extract-text-webpack-plugin') // 分离css到独立文件
const HtmlWebpackPlugin = require('html-webpack-plugin') // 自动生成html 入口文件
const UglifyjsWebpackPlugin = require('uglifyjs-webpack-plugin') // js 压缩

module.exports = {
  entry: {
    index: path.resolve(base, 'src', 'js/index.js'), // 多入口
    main: path.resolve(base, 'src', 'js/main.js')
  },
  // entry: path.resolve(base, 'src', 'js/index.js'), // 单入口
  output: {
    filename: 'js/[name].js',
    path: path.resolve(base, 'dist')
  },
  // output: {
  //   filename: 'bundle.js',
  //   path: path.resolve(base, 'dist')
  // },
  devtool: 'eval-source-map',
  devServer: {
    contentBase: path.resolve(base, 'dist'),
    historyApiFallback: true,
    inline: true,
    proxy: {
      '/api': 'http://localhost:8800'
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env']
          }
        }
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                modules: true,
                localIdentName: '[path][name]__[local]--[hash:base64:5]',
                minimize: true // 是否压缩
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                config: {
                  path: path.resolve(base, 'config', 'postcss.config.js')
                }
              }
            }]
        })
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                modules: true,
                localIdentName: '[path][name]__[local]--[hash:base64:5]',
                minimize: true // 是否压缩
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                config: {
                  path: path.resolve(base, 'config', 'postcss.config.js')
                }
              }
            },
            {
              loader: 'sass-loader'
            }]
        })
      },
      {
        test: /\.(png|jpg|gif)/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              fallback: 'file-loader',
              name: '[hash:5].[ext]', // publicPath: 'https://cdn.j2do.com',
              outputPath: 'images/'
            }
          }]
      },
      {
        enforce: 'pre',
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
        options: {
          fix: true // 自动修复不规范代码
        }
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin('css/[name].css'),
    new HtmlWebpackPlugin({// 自动 生成入口 文件(无需手动引用css js)
      title: 'Index Page',
      template: path.resolve(base, 'src', 'template/index.tmpl'),
      filename: 'index.html',
      chunks: ['index']
    }),
    new HtmlWebpackPlugin({
      title: 'Main Page',
      template: path.resolve(base, 'src', 'template/main.tmpl'),
      filename: 'main.html',
      chunks: ['main']
    }),
    new UglifyjsWebpackPlugin()
  ]
}

var webpack = require('webpack');

module.exports = (env) => {
  const isProd = env.production === true;

  const entries = [];
  !isProd && entries.push('webpack-dev-server/client?http://localhost:8080');
  !isProd && entries.push('webpack/hot/only-dev-server');
  entries.push('./src/index.jsx');

  const jsLoaders = [];
  !isProd && jsLoaders.push('react-hot-loader');
  jsLoaders.push('babel-loader');

  const publicPath = isProd ? 'http://localhost/' : 'http://localhost:8080/';

  const plugins = [];
  !isProd && plugins.push(new webpack.HotModuleReplacementPlugin());

  return {
    entry: entries,
    mode: isProd ? 'production' : 'development',
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: jsLoaders,
        },
        {
          test: /\.css$/,
          exclude: /global\.css$/,
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
                localIdentName: '[name]_[local]_[hash:base64]',
                modules: true
              }
            },
            'postcss-loader'
          ]
        },
        {
          test: /global\.css$/,
          loader: 'style-loader!css-loader!postcss-loader'
        }
      ]
    },
    resolve: {
      extensions: ['.js', '.jsx']
    },
    output: {
      path: __dirname + '/dist',
      publicPath,
      filename: 'bundle.js'
    },
    devServer: {
      contentBase: './dist',
      hot: true,
      proxy: {
        '/api/**': {
          target: 'http://localhost',
          secure: false,
          logLevel: 'debug'
        }
      }
    },
    plugins,
  };
};

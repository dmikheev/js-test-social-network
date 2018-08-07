module.exports = (env = {}) => {
  const isProd = env.production === true;
  const publicPath = isProd ? 'http://localhost/' : 'http://localhost:8080/';

  return {
    entry: './src/index.jsx',
    mode: isProd ? 'production' : 'development',
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
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
      filename: '[name].bundle.js'
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
  };
};

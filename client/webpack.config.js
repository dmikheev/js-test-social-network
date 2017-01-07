var webpack = require('webpack');

module.exports = {
  entry: [
    'webpack-dev-server/client?http://localhost:8080',
    'webpack/hot/only-dev-server',
    './src/index.jsx'
  ],
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'react-hot!babel'
      },
      {
        test: /\.css$/,
        exclude: /global\.css$/,
        loader: 'style-loader!css-loader?modules&localIdentName=[name]_[local]_[hash:base64]!postcss-loader'
      },
      {
        test: /global\.css$/,
        loader: 'style-loader!css-loader!postcss-loader'
      }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  output: {
    path: __dirname + '/dist',
    publicPath: 'http://localhost:8080/',
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
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.OldWatchingPlugin()
  ]
};

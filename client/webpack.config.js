module.exports = (env = {}) => {
  const isProd = env.production === true;
  const publicPath = isProd ? 'http://localhost/' : 'http://localhost:8080/';

  return {
    devServer: {
      contentBase: './dist',
      historyApiFallback: true,
      hot: true,
      proxy: {
        '/api/**': {
          logLevel: 'debug',
          secure: false,
          target: 'http://localhost',
        },
      },
    },
    devtool: isProd ? false : 'cheap-module-source-map',
    entry: './src/index.tsx',
    mode: isProd ? 'production' : 'development',
    module: {
      rules: [
        {
          exclude: /node_modules/,
          test: /\.[jt]sx?$/,
          use: [
            'babel-loader',
            'awesome-typescript-loader',
            {
              loader: 'tslint-loader',
              options: {
                typeCheck: true,
              },
            },
          ],
        },
        {
          exclude: /global\.css$/,
          test: /\.css$/,
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
                localIdentName: '[name]_[local]_[hash:base64:5]',
                modules: true,
              },
            },
            'postcss-loader',
          ],
        },
        {
          loader: 'style-loader!css-loader!postcss-loader',
          test: /global\.css$/,
        },
      ],
    },
    output: {
      filename: '[name].bundle.js',
      path: __dirname + '/dist',
      publicPath,
    },
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
  };
};

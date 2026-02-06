const path = require('path');

module.exports = function override(config, env) {
  // Add a rule for handling image files
  config.module.rules.push({
    test: /\.(png|jpe?g|gif|svg)$/i,
    use: [
      {
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: 'images/',
          publicPath: '/images/'
        }
      }
    ]
  });

  // Add resolve alias for public directory
  config.resolve.alias = {
    ...config.resolve.alias,
    '@public': path.resolve(__dirname, 'public')
  };

  // Set the port
  process.env.PORT = 3002;

  return config;
}; 
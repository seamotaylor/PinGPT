const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: {
        background: './src/background.js',
        content: './src/content.js',
        'sidebar/sidebar': './src/sidebar/sidebar.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        clean: true
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                {
                    from: 'manifest.json',
                    to: 'manifest.json'
                },
                {
                    from: 'src/sidebar/sidebar.html',
                    to: 'src/sidebar/sidebar.html'
                },
                {
                    from: 'src/sidebar/sidebar.css',
                    to: 'src/sidebar/sidebar.css'
                },
                {
                    from: 'icon16.png',
                    to: 'icon16.png'
                },
                {
                    from: 'icon48.png',
                    to: 'icon48.png'
                },
                {
                    from: 'icon128.png',
                    to: 'icon128.png'
                }
            ]
        })
    ],
    devtool: 'source-map',
    resolve: {
        extensions: ['.js']
    },
    optimization: {
        splitChunks: {
            chunks: 'all',
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all'
                }
            }
        }
    }
};
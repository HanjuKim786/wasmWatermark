const path = require('path');

const webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopywebpackPlugin = require('copy-webpack-plugin');

const cesiumSource = 'node_modules/cesium/Source';
const cesiumWorkers = '../Build/Cesium/Workers';

module.exports = {
    mode: "development", //porduction, development
    context: __dirname,
    entry: {
        index: './src/js/index.js',
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
        // Needed to compile multiline strings in Cesium
        sourcePrefix: ''
    },
    amd: {
        // Enable webpack-friendly use of require in Cesium
        toUrlUndefined: true
    },
    node: {
        // Resolve node module use of fs
        fs: 'empty'
    },
    resolve: {
        alias: {
            // CesiumJS module name
            //cesium: path.resolve(__dirname, cesiumSource)
        }
    },

    module: {
        rules: [
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            },
            {
                test: /\.(png|jpg|gif)$/i,
                use: [
                {
                    loader: 'url-loader',
                    options: {
                        name: '[name].[ext]',
                        limit: 1024,
                        fallback: 'file-loader'
                    }
                }
                ]
            },
            {
                test: /\.json$/,
                loader: "json-loader",
                type: "javascript/auto"
            }
        ]
    },
    optimization: {
        minimize: false
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html'
        }),
        new webpack.LoaderOptionsPlugin({
            options: {
                experiments:{
                    asyncWebAssembly: true,
                    syncWebAssembly: true
                }
            }
          })
    ],

    devServer: {
        contentBase: path.join(__dirname, "dist"),
        port: 80,
        inline: true,
        host: 'localhost',
        disableHostCheck: true,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
            "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
          }
    },
    
};
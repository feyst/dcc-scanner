const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = (env, argv) => {
    let config = {
        mode: 'development',
        output: {
            filename: '[name].[contenthash].js',
            path: path.resolve(__dirname, 'dist'),
            clean: {
                keep: /^\.gitkeep$/,
            },
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: 'src/index.html'
            }),
            new WorkboxPlugin.GenerateSW({
                // these options encourage the ServiceWorkers to get in there fast
                // and not allow any straggling "old" SWs to hang around
                clientsClaim: true,
                skipWaiting: true,
                maximumFileSizeToCacheInBytes: 99999999999999,
            }),
            new WebpackPwaManifest({
                publicPath: '/',
                name: 'Covid QR scanner',
                short_name: 'Covid scanner',
                description: 'Covid QR scanner, show information inside the DCC (digital covid certificate) QR',
                background_color: '#ffffff',
                theme_color: '#ffffff',
                icons: [
                    {
                        src: path.resolve('src/icon.svg'),
                        sizes: [150]
                    },
                    {
                        src: path.resolve('src/icon-512.png'),
                        sizes: [512]
                    },
                ]
            }),
        ],
        optimization: {
            runtimeChunk: 'single',
            splitChunks: {
                cacheGroups: {
                    vendor: {
                        test: /[\\/]node_modules[\\/]/,
                        name: 'vendors',
                        chunks: 'all',
                    },
                },
            },
        },
        module: {
            rules: [
                {
                    test: /\.css$/i,
                    use: ['style-loader', 'css-loader'],
                },
                {
                    test: /\.(png|svg|jpg|jpeg|gif)$/i,
                    type: 'asset/resource',
                },
                {
                    test: /\.html$/i,
                    loader: 'html-loader',
                },
            ],
        },
        devServer: {
            contentBase: path.join(__dirname, 'dist'),
            https: true,
            host: '0.0.0.0',
            compress: true,
            port: 8006,
        },
        resolve: {
            fallback: {
                crypto: false,
                stream: false,
                fs: false,
                util: false,
                path: false,
                assert: false,
            }
        },
    }

    if('production' === argv.mode){
        config.mode = 'production'
    }

    return config
};
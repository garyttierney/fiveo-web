'use strict';

module.exports = {
    devtool: 'inline-source-map',
    entry: './src/index.ts',
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: 'ts-loader'
            },
            {
                test: /\.rs$/,
                use: [
                    {
                        loader: 'wasm-loader'
                    }, {
                        loader: 'rust-native-wasm-loader',
                        options: {
                            release: true
                        }
                    }
                ]
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.rs']
    }
};
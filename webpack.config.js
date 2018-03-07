'use strict';

module.exports = {
    devtool: 'source-map',
    output: {
        libraryTarget: 'umd',
        library: 'fiveo',
        umdNamedDefine: true,
        globalObject: 'typeof self !== \'undefined\' ? self : this',
    },
    },
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
                            release: true,
                            gc: true
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
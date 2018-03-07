'use strict';

module.exports = {
    devtool: 'source-map',
    output: {
        libraryTarget: 'umd',
        library: 'fiveo',
        umdNamedDefine: true,
        globalObject: 'typeof self !== \'undefined\' ? self : this',
    },
    entry: {
        main: './src/index.ts',
        english_dictionary_bench_suite: './bench_suite/english_dictionary_bench_suite.ts'
    },
    module: {
        noParse: [
            /^benchmark$/,
        ],
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
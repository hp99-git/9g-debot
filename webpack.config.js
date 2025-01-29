const sass = require("sass");
const path = require("path");
const webpack = require("webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const getPlugins = (env) => {
    let plugins = [
        new webpack.DefinePlugin({
            "process.env.NODE_ENV": JSON.stringify(env.mode),
        }),
        new CleanWebpackPlugin(),
    ];

    return plugins;
};

module.exports = (env) => {
    return {
        entry: {
            app: "./src/index.js",
        },
        output: {
            filename: `[name].js`,
            path: path.resolve(__dirname, "dist"),
            publicPath: "/",
        },
        resolve: {
            alias: {
                "@": path.resolve(__dirname, "src"),
                "@node_modules": path.resolve(__dirname, "node_modules"),
            },
        },
        devtool: env.mode == "production" ? undefined : "eval-source-map",
        mode: env.mode,
        watchOptions: {
            ignored: /node_modules/,
        },
        module: {
            rules: [
                {
                    test: /\.jsx?$/,
                    exclude: /(node_modules)/,
                    use: {
                        loader: "babel-loader",
                        options: {
                            presets: [
                                [
                                    "@babel/preset-env",
                                    {
                                        useBuiltIns: "usage",
                                        corejs: 3.4,
                                        targets: {
                                            chrome: "114",
                                            edge: "114",
                                        },
                                    },
                                ],
                                [
                                    "@babel/preset-react",
                                    {
                                        runtime: "automatic",
                                        useSpread: true,
                                    },
                                ],
                            ],
                            plugins: ["react-html-attrs"],
                        },
                    },
                },
                {
                    test: /\.s?css$/,
                    use: [
                        {
                            loader: "css-loader",
                            options: {
                                sourceMap: env.mode !== "production",
                            },
                        },
                        {
                            loader: "postcss-loader",
                            options: {
                                postcssOptions: {
                                    plugins: [["postcss-preset-env", {}]],
                                },
                            },
                        },
                        {
                            loader: "sass-loader",
                            options: {
                                implementation: sass,
                                sassOptions: {
                                    outputStyle: env.mode === "production" ? "compressed" : "expanded",
                                    quietDeps: true, // Don't show warnings from dependencies.
                                },
                                sourceMap: env.mode !== "production",
                            },
                        },
                    ],
                },
            ],
        },
        optimization: {
            nodeEnv: env.mode === "production" ? "production" : "development",
        },
        plugins: getPlugins(env),
        target: "web",
    };
};

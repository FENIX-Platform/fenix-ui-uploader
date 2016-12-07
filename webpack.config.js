var distFolderPath = "dist",
    demoFolderPath = "demo",
    devFolderPath = "dev",
    webpack = require('webpack'),
    packageJson = require("./package.json"),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    CleanWebpackPlugin = require('clean-webpack-plugin'),
    Path = require('path'),
    dependencies = Object.keys(packageJson.dependencies);


module.exports = {

    debug: isProduction(false, true),

    devtool: isProduction('source-map', 'eval'),

    entry: getEntry(),

    output: getOutput(),

    resolve: {
        root: Path.resolve(__dirname),
        alias: {
            handlebars: 'handlebars/dist/handlebars.min.js',
            jquery: Path.join(__dirname, 'node_modules/jquery/dist/jquery'),
            // plugin fatti coi piedi
                'load-image': 'blueimp-load-image/js/load-image.js',
                'load-image-meta': 'blueimp-load-image/js/load-image-meta.js',
                'load-image-exif': 'blueimp-load-image/js/load-image-exif.js',
                'canvas-to-blob': 'blueimp-canvas-to-blob/js/canvas-to-blob.js',
                'jquery-ui/widget': 'blueimp-file-upload/js/vendor/jquery.ui.widget.js'

        }
    },

    externals: isProduction(dependencies, undefined),

    module: {
        loaders: [
            {test: /\.hbs$/, loader: "handlebars-loader"},
        ]
    },

    plugins: clearArray([
        new webpack.ProvidePlugin({$: "jquery", jQuery: "jquery"}),
        isDemo(undefined, new CleanWebpackPlugin([distFolderPath])),
        isProduction(new CleanWebpackPlugin([distFolderPath]), undefined),
        isProduction(new webpack.optimize.UglifyJsPlugin({
            compress: {warnings: false},
            output: {comments: false}
        })),
        isDevelop(new HtmlWebpackPlugin({
            inject: "body",
            template: devFolderPath + "/index.template.html"
        }))
    ])

};

function getEntry() {

    var entry = {};

    switch (getEnvironment()) {

        case "demo" :
            entry["app"] = ["demo/src/js/demo.js"];
            break;
        case "develop" :
            entry["app"] = ["dev/src/js/dev.js"];
            break;
        default :
            entry["app"] = ["./src/js/index.js"];
    }

    return entry;
}

function getOutput() {

    var output;

    switch (getEnvironment()) {

        case "demo" :
            output = {
                path: Path.join(__dirname, demoFolderPath, distFolderPath),
                filename: "index.js"
            };
            break;
        case "production" :
            output = {
                path: Path.join(__dirname, distFolderPath),
                filename: packageJson.name + '.min.js',
                chunkFilename: 'chunk-[id].' + packageJson.name + '.min.js',
                libraryTarget: 'amd'
            };
            break;
        case "develop" :
            output = {
                path: Path.join(__dirname, devFolderPath, distFolderPath),
                //publicPath: "/dev/",
                filename: "index.js"
            };
            break;
        default :
            output = {
                path: Path.join(__dirname, distFolderPath),
                filename: "index.js"
            };
            break;
    }

    return output;
}

// utils

function clearArray(array) {

    var result = [];

    array.forEach(function (s) {
        s ? result.push(s) : null;
    });

    return result;

}

function isProduction(valid, invalid) {

    return isEnvironment('production') ? valid : invalid;
}

function isDevelop(valid, invalid) {

    return isEnvironment('develop') ? valid : invalid;
}

function isTest(valid, invalid) {

    return isEnvironment('develop') ? valid : invalid;
}

function isDemo(valid, invalid) {

    return isEnvironment('demo') ? valid : invalid;
}

function isEnvironment(env) {
    return getEnvironment() === env;
}

function getEnvironment() {
    return process.env.NODE_ENV;
}
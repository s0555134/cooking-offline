// vue.config.js
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    // ...other vue-cli plugin options...
    lintOnSave: false,
    chainWebpack: config => {
        config.module.rules.delete('eslint');
    },
    configureWebpack: {
        plugins: [
            new CopyPlugin([
                { from: 'src/assets/*', to: 'images' },
            ]),
        ],
    },
    pwa: {
        // configure the workbox plugin
        workboxPluginMode: 'InjectManifest',
        workboxOptions: {
            // swSrc is required in InjectManifest mode.
            swSrc: 'src/service-worker.js',
            // ...other Workbox options...
        }
    }
};

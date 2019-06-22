// vue.config.js
module.exports = {
    // ...other vue-cli plugin options...
    lintOnSave: false,
    chainWebpack: config => {
        config.module.rules.delete('eslint');
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

module.exports = {
    devServer: {
        host: 'localhost',  // disable network access
        proxy: {
            '/api': {
                target: 'http://127.0.0.1:5001',
                changeOrigin: true
            }
        }
    }
};
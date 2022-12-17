const PROXY_CONFIG = [
  {
    context: ['/api'],
    target: 'http://localhost:9999/',
    secure: false,
    changeOrigin: true,
  },
  {
    context: ['/aps-job-admin'],
    target: 'http://10.16.90.157:9900/',
    secure: false,
    changeOrigin: true,
    // pathRewrite: {
    //   '^/api': '',
    // },
  },
];
module.exports = PROXY_CONFIG;

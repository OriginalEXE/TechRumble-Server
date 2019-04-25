module.exports = {
  apps: [
    {
      name: 'techrumble',
      script: './src/index.js',
      watch: true,
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
}

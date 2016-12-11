const esModules = process.env.BABEL_ENV === 'es';
module.exports = {
  presets: [
    ['es2015', { modules: esModules ? false : 'commonjs' }]
  ]
};

module.exports = {
    presets: [['@babel/env', { loose: true }], '@babel/flow', '@babel/preset-react'],
    plugins: [['@babel/proposal-class-properties', { loose: true }], 'annotate-pure-calls'],
};

module.exports = {
  extends: ['../../.eslintrc.cjs'],
  settings: {
    'import/resolver': {
      node: {
        paths: ['~/'],
        extensions: ['.js', '.ts'],
      },
      alias: {
        map: [['~', './']],
        extensions: ['.ts', '.js'],
      },
    },
  },
}

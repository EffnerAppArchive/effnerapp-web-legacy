module.exports = {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    screens: {
      'smolest': '350px',
      'smol': '375px',
      'norm': '400px',
      'bigus': '420px',
      'thiccc': '500px' // https://youtu.be/CPk3trWIDCU
    }
  },
  variants: {
    extend: {}
  },
  plugins: []
};

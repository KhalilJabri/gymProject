/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    fontFamily: {
      display: ['Open Sans', 'sans-serif'],
      body: ['Open Sans', 'sans-serif'],
    },
    
    extend: {
      fontSize: {
        16: '16px',
        10: '10px',
        8: '8px',
      },
      margin : {
        m:'40%',
        '15%':'15%',
        '35%':'35%',
        '30%':'30%',
      },
      spacing: {
        _360:'360px',
        _266: '266px',
        _10:'10px',
      },  
      screens: {
        xs : '400px',
        och:'810px',
        thr:'320px',
      },
      boxShadow :{
        xs: '1px 1px 5px 1px rgba(0,0,0,0.2);',
        sh1:'1px 1px 3px 1px rgba(0,0,0,0.2);',
      },
      backgroundColor: {
        'main-bg': '#FAFBFB',
        'main-dark-bg': '#20232A',
        'secondary-dark-bg': '#33373E',
        'light-gray': '#F7F7F7',
        'half-transparent': 'rgba(0, 0, 0, 0.5)',
        'eBony' : '#2F3B30',
        'mimosa' : '#F7C350',
      },
      borderWidth: {
        1: '1px',
      },
      borderColor: {
        color: 'rgba(0, 0, 0, 0.1)',
        eBony : '#2F3B30',
      },
      width: {
        400: '400px',
        760: '760px',
        780: '780px',
        800: '800px',
        1000: '1000px',
        1200: '1200px',
        1400: '1400px',
      },
      height: {
        80: '80px',
      },
      minHeight: {
        590: '590px',
      },
    },
  },
  plugins: [],
};

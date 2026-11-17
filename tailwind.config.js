/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './assets/js/**/*.js'],
  theme: {
    extend: {
      colors: {
        /* Gallery-dark theme: "ink" is now the light text color,
           "paper" the deep page ground — classes flip automatically. */
        ink: '#F3F1EB',
        paper: '#0A0A09',
        haze: '#141413',
        mist: '#F3F1EB',
        void: '#070706',
        klein: '#3D5BFF',
        'klein-bright': '#7B8CFF',
        'klein-deep': '#0C1E9A'
      },
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          '"PingFang SC"',
          '"HarmonyOS Sans SC"',
          '"MiSans"',
          '"Noto Sans SC"',
          '"Microsoft YaHei"',
          '"WenQuanYi Micro Hei"',
          'sans-serif'
        ],
        display: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          '"PingFang SC"',
          '"HarmonyOS Sans SC"',
          '"MiSans"',
          '"Noto Sans SC"',
          '"Microsoft YaHei"',
          '"WenQuanYi Micro Hei"',
          'sans-serif'
        ],
        serif: [
          '"Instrument Serif"',
          '"Iowan Old Style"',
          '"Songti SC"',
          '"Noto Serif SC"',
          '"Source Han Serif SC"',
          '"STSong"',
          '"SimSun"',
          'Georgia',
          '"Times New Roman"',
          'serif'
        ],
        mono: [
          '"JetBrains Mono"',
          'ui-monospace',
          'SFMono-Regular',
          '"SF Mono"',
          '"Cascadia Mono"',
          'Consolas',
          '"Liberation Mono"',
          '"PingFang SC"',
          '"Microsoft YaHei"',
          'monospace'
        ]
      }
    }
  },
  plugins: []
};
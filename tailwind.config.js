const defaultTheme = require("tailwindcss/defaultTheme");
const plugin = require("tailwindcss/plugin");
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/*.{js,ts,jsx,tsx}",
    "./public/static/*.js",
    "./app/**/src/*.{tsx,ts,js,jsx}",
    "./pkg/**/src/*.{tsx,ts,js,jsx}",
  ],

  darkMode: ["class"],
  plugins: [
    require("tailwindcss-animate"),
    require("@headlessui/tailwindcss"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/aspect-ratio"), 
    require("@tailwindcss/forms"),

    plugin(function ({ addVariant, e, postcss }) {
      addVariant('firefox', ({ container, separator }) => {
      const isFirefoxRule = postcss.atRule({
        name: '-moz-document',
        params: 'url-prefix()',
      });
      isFirefoxRule.append(container.nodes);
      container.append(isFirefoxRule);
      isFirefoxRule.walkRules((rule) => {
        rule.selector = `.${e(
        `firefox${separator}${rule.selector.slice(1)}`
        )}`;
      })
    })}),
    plugin(function ({ addUtilities }) {
      addUtilities({
        '.bg-gradient-to-br': {
          'background-image': 'linear-gradient(to bottom right, #3490dc, #6574cd)',
        },
      })
    })
  ],
  theme: {
    container: {
      center: true,

    },
    extend: {
      fontFamily: {
        sans: ["Inter var", "Helvetica Neue", ...defaultTheme.fontFamily.sans],
      },
      boxShadow: {
        "shadow-up":
          "0 -4px 6px -1px rgba(0, 0, 0, 0.1), 0 -2px 4px -1px rgba(0, 0, 0, 0.06)",
      },
      colors: {
        chat: {
          background: "#ffffff",
          bubble: "#f7f8fa",
          text: "#000000",
          input: "#ffffff",
          shadow: "#ecf0f1",
          placeholder: "#787878",
          button: "#fbfbfc",
          settings: "#f7f8fa",
          border: "#eef0f1",
          apply: "#1b1c3b",
          helpertext: "#8a8a8a",
        },
      },
    },
  },
};

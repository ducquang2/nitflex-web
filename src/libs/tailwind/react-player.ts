// @ts-expect-error - Haven't find a way to fix this yet
const reactPlayerPlugin = ({ addComponents, theme }) => {
  addComponents({
    '.rounded-react-player': {
      iframe: {
        'border-radius': theme('borderRadius.lg'),
      },
    },
  })
}

export default reactPlayerPlugin

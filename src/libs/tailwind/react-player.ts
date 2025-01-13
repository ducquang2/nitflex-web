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

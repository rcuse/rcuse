import type { Preview } from '@storybook/react'
import '@arco-design/web-react/dist/css/arco.css'
import './globals.css'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
}

export default preview

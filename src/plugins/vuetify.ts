import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

export default createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi
    }
  },
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#902de0',
          primaryLight: '#b13df5',
          secondary: '#e07e2d',
          background: '#ededed',
          surface: '#ffffff',
          'primary-darken-1': '#6a21a6',
          'secondary-darken-1': '#d98b2d',
          'on-primary': '#ffffff',
          'on-secondary': '#ffffff',
          'on-background': '#1a1a1a',
          'on-surface': '#1a1a1a',
          'bg-python': '#306998',
          'bg-rust': '#b7410e',
          'bg-javascript': '#f0db4f',
          'bg-lua': '#000080',
          'bg-json': '#66d9ef',
          'bg-csv': '#f92672',
          'bg-xml': '#a6e22e',
          'bg-html': '#e6db74',
          'bg-markdown': '#ae81ff',
          'bg-jpeg': '#fd971f',
          'bg-png': '#e74c3c',
          'bg-heic': '#8e44ad',
          'bg-txt': '#2ecc71',
          'bg-yaml': '#3498db',
          'bg-pdf': '#c0392b'
        },
        variables: {
          'border-color': '#4a4a4a'
        }
      },
      dark: {
        colors: {
          primary: '#7158e0',
          primaryLight: '#b13df5',
          secondary: '#d98b2d',
          background: '#1a1a1a',
          surface: '#2c2c2c',
          'primary-darken-1': '#6a21a6',
          'secondary-darken-1': '#d98b2d',
          'on-primary': '#ededed',
          'on-secondary': '#ededed',
          'on-background': '#ededed',
          'on-surface': '#ededed',
          'bg-python': '#306998',
          'bg-rust': '#b7410e',
          'bg-javascript': '#f0db4f',
          'bg-lua': '#000080'
        },
        variables: {
          'border-color': '#a8a8a8'
        }
      }
    }
  },
  defaults: {
    VBtn: {
      color: 'primary',
      variant: 'flat'
    }
  }
})

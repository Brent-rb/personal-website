import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'

// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import '@mantine/core/styles.css';
import { createTheme, MantineColorsTuple, MantineProvider } from '@mantine/core';


const primaryRed: MantineColorsTuple = [
  '#fbefef',
  '#efdcdc',
  '#e1b4b5',
  '#d58a8b',
  '#cb6767',
  '#c55151',
  '#c34645',
  '#ac3837',
  '#9a3030',
  '#872628'
];

const theme = createTheme({
  primaryColor: "primary-red",
  colors: {
    "primary-red": primaryRed,
  }
});

// Import the generated route tree
import { routeTree } from './routeTree.gen'
import { createRouter, RouterProvider } from '@tanstack/react-router'


// Create a new router instance
const router = createRouter({ routeTree })

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

// Render the app
const rootElement = document.getElementById('root')!
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <MantineProvider theme={theme}>
        <RouterProvider router={router} />
      </MantineProvider>
    </StrictMode>,
  )
}
"use client"

import { ThemeProvider } from "./contexts/ThemeContext"
import { AlertProvider } from "./contexts/AlertContext"
import StyledComponentsRegistry from "./lib/registry"
import "./globals.css"

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <StyledComponentsRegistry>
          <ThemeProvider>
            <AlertProvider>{children}</AlertProvider>
          </ThemeProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  )
}

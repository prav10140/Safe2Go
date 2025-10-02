"use client"
import styled from "styled-components"
import { useTheme } from "../contexts/ThemeContext"
import { Moon, Sun, Shield } from "lucide-react"

const HeaderContainer = styled.header`
  background: ${(props) => props.theme.colors.surface};
  border-bottom: 1px solid ${(props) => props.theme.colors.border};
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
`

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.5rem;
  font-weight: bold;
  color: ${(props) => props.theme.colors.primary};
`

const ThemeToggle = styled.button`
  background: ${(props) => props.theme.colors.background};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  color: ${(props) => props.theme.colors.text};

  &:hover {
    background: ${(props) => props.theme.colors.primary};
    color: white;
    transform: scale(1.05);
  }
`

const Header = () => {
  const theme = useTheme()

  return (
    <HeaderContainer theme={theme}>
      <Logo theme={theme}>
        <Shield size={24} />
        SmartHelmet
      </Logo>
      <ThemeToggle onClick={theme.toggleTheme} theme={theme}>
        {theme.isDark ? <Sun size={20} /> : <Moon size={20} />}
      </ThemeToggle>
    </HeaderContainer>
  )
}

export default Header

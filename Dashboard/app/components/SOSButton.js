"use client"
import styled, { keyframes } from "styled-components"
import { useTheme } from "../contexts/ThemeContext"
import { useAlert } from "../contexts/AlertContext"
import { Phone } from "lucide-react"

const pulse = keyframes`
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(225, 112, 85, 0.7);
  }
  70% {
    transform: scale(1.05);
    box-shadow: 0 0 0 10px rgba(225, 112, 85, 0);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(225, 112, 85, 0);
  }
`

const SOSContainer = styled.div`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 1000;
`

const SOSButtonStyled = styled.button`
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: ${(props) => props.theme.colors.error};
  border: none;
  color: white;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 20px rgba(225, 112, 85, 0.4);
  transition: all 0.3s ease;
  animation: ${pulse} 2s infinite;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 30px rgba(225, 112, 85, 0.6);
  }

  &:active {
    transform: scale(0.95);
  }

  @media (max-width: 768px) {
    width: 60px;
    height: 60px;
    bottom: 1rem;
    right: 1rem;
  }
`

const SOSButton = () => {
  const theme = useTheme()
  const { handleSOS } = useAlert()

  const handleClick = () => {
    if (window.confirm("Are you sure you want to trigger an SOS alert?")) {
      handleSOS()
    }
  }

  return (
    <SOSContainer>
      <SOSButtonStyled onClick={handleClick} theme={theme}>
        <Phone size={24} />
      </SOSButtonStyled>
    </SOSContainer>
  )
}

export default SOSButton

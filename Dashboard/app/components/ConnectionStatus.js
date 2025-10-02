"use client"
import styled from "styled-components"
import { useTheme } from "../contexts/ThemeContext"
import { useAlert } from "../contexts/AlertContext"
import { Wifi, WifiOff } from "lucide-react"

const StatusIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  background: ${(props) => (props.connected ? props.theme.colors.success : props.theme.colors.error)};
  color: white;
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 1000;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);

  @media (max-width: 768px) {
    top: 0.5rem;
    right: 0.5rem;
    font-size: 0.7rem;
    padding: 0.4rem 0.8rem;
  }
`

const ConnectionStatus = () => {
  const theme = useTheme()
  const { isFirebaseConnected } = useAlert()

  return (
    <StatusIndicator connected={isFirebaseConnected} theme={theme}>
      {isFirebaseConnected ? <Wifi size={16} /> : <WifiOff size={16} />}
      {isFirebaseConnected ? "Live" : "Offline"}
    </StatusIndicator>
  )
}

export default ConnectionStatus

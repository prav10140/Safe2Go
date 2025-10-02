"use client"
import styled from "styled-components"
import { useTheme } from "../contexts/ThemeContext"
import { useAlert } from "../contexts/AlertContext"
import { AlertTriangle, Shield, Zap, Phone, Clock } from "lucide-react"

const LogContainer = styled.div`
  background: ${(props) => props.theme.colors.surface};
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border: 1px solid ${(props) => props.theme.colors.border};
  max-height: 500px;
  overflow-y: auto;
`

const LogHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`

const LogTitle = styled.h3`
  color: ${(props) => props.theme.colors.text};
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
`

const AlertItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  margin-bottom: 0.5rem;
  border-radius: 8px;
  background: ${(props) => props.theme.colors.background};
  border-left: 4px solid ${(props) => {
    switch (props.severity) {
      case "critical":
        return props.theme.colors.error
      case "warning":
        return props.theme.colors.warning
      case "info":
        return props.theme.colors.info
      default:
        return props.theme.colors.primary
    }
  }};
  transition: transform 0.2s ease;

  &:hover {
    transform: translateX(4px);
  }
`

const AlertIcon = styled.div`
  color: ${(props) => {
    switch (props.severity) {
      case "critical":
        return props.theme.colors.error
      case "warning":
        return props.theme.colors.warning
      case "info":
        return props.theme.colors.info
      default:
        return props.theme.colors.primary
    }
  }};
  margin-top: 0.2rem;
`

const AlertContent = styled.div`
  flex: 1;
`

const AlertMessage = styled.div`
  color: ${(props) => props.theme.colors.text};
  font-weight: 500;
  margin-bottom: 0.25rem;
`

const AlertTime = styled.div`
  color: ${(props) => props.theme.colors.textSecondary};
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`

const EmptyState = styled.div`
  text-align: center;
  color: ${(props) => props.theme.colors.textSecondary};
  padding: 2rem;
  font-style: italic;
`

const getAlertIcon = (type) => {
  switch (type) {
    case "accident":
      return AlertTriangle
    case "helmet":
      return Shield
    case "fatigue":
      return Zap
    case "sos":
      return Phone
    default:
      return AlertTriangle
  }
}

const formatTime = (timestamp) => {
  const date = new Date(timestamp)
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })
}

const AlertLog = () => {
  const theme = useTheme()
  const { alerts } = useAlert()

  return (
    <LogContainer theme={theme}>
      <LogHeader>
        <Clock size={20} color={theme.colors.primary} />
        <LogTitle theme={theme}>Alert History</LogTitle>
      </LogHeader>

      {alerts.length === 0 ? (
        <EmptyState theme={theme}>No alerts recorded yet</EmptyState>
      ) : (
        alerts.map((alert) => {
          const IconComponent = getAlertIcon(alert.type)
          return (
            <AlertItem key={alert.id} severity={alert.severity} theme={theme}>
              <AlertIcon severity={alert.severity} theme={theme}>
                <IconComponent size={18} />
              </AlertIcon>
              <AlertContent>
                <AlertMessage theme={theme}>{alert.message}</AlertMessage>
                <AlertTime theme={theme}>
                  <Clock size={12} />
                  {formatTime(alert.timestamp)}
                </AlertTime>
              </AlertContent>
            </AlertItem>
          )
        })
      )}
    </LogContainer>
  )
}

export default AlertLog

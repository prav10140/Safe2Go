"use client"
import styled from "styled-components"
import { useTheme } from "../contexts/ThemeContext"

const Card = styled.div`
  background: ${(props) => props.theme.colors.surface};
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border: 1px solid ${(props) => props.theme.colors.border};
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  }
`

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`

const CardTitle = styled.h3`
  color: ${(props) => props.theme.colors.text};
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
`

const StatusBadge = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  background: ${(props) => {
    switch (props.status) {
      case "connected":
      case "normal":
      case "safe":
        return props.theme.colors.success
      case "warning":
      case "tired":
        return props.theme.colors.warning
      case "disconnected":
      case "critical":
      case "accident":
        return props.theme.colors.error
      default:
        return props.theme.colors.info
    }
  }};
  color: white;
`

const CardContent = styled.div`
  color: ${(props) => props.theme.colors.textSecondary};
  font-size: 0.9rem;
  line-height: 1.5;
`

const StatusCard = ({ title, status, description, icon: Icon }) => {
  const theme = useTheme()

  return (
    <Card theme={theme}>
      <CardHeader>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          {Icon && <Icon size={20} color={theme.colors.primary} />}
          <CardTitle theme={theme}>{title}</CardTitle>
        </div>
        <StatusBadge status={status} theme={theme}>
          {status}
        </StatusBadge>
      </CardHeader>
      <CardContent theme={theme}>{description}</CardContent>
    </Card>
  )
}

export default StatusCard

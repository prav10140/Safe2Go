"use client"
import styled from "styled-components"
import { useTheme } from "./contexts/ThemeContext"
import { useAlert } from "./contexts/AlertContext"
import Header from "./components/Header"
import StatusCard from "./components/StatusCard"
import MapComponent from "./components/MapComponent"
import AlertLog from "./components/AlertLog"
import SOSButton from "./components/SOSButton"
import EmergencyModal from "./components/EmergencyModal"
import ConnectionStatus from "./components/ConnectionStatus"
import { Shield, AlertTriangle, Zap, MapPin } from "lucide-react"

const AppContainer = styled.div`
  min-height: 100vh;
  background: ${(props) => props.theme.colors.background};
  transition: background-color 0.3s ease;
`

const MainContent = styled.main`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`

const StatusGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`

const MapSection = styled.div`
  margin-bottom: 2rem;
`

const LastUpdate = styled.div`
  text-align: center;
  color: ${(props) => props.theme.colors.textSecondary};
  font-size: 0.9rem;
  margin-bottom: 1rem;
`

const FirebaseStatus = styled.div`
  text-align: center;
  color: ${(props) => props.theme.colors.textSecondary};
  font-size: 0.8rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`

export default function Home() {
  const theme = useTheme()
  const { currentStatus, isFirebaseConnected } = useAlert()

  const getStatusDescription = (type, status) => {
    switch (type) {
      case "helmet":
        return status === "connected"
          ? "Helmet is properly connected and functioning"
          : "Helmet connection lost - check device"
      case "accident":
        return status ? "ACCIDENT DETECTED - Emergency protocols activated" : "No accidents detected - rider is safe"
      case "fatigue":
        return status === "normal"
          ? "Rider alertness levels are normal"
          : status === "tired"
            ? "Rider showing signs of fatigue - recommend rest"
            : "Critical fatigue detected - immediate rest required"
      default:
        return "Status information"
    }
  }

  return (
    <AppContainer theme={theme}>
      <Header />
      <ConnectionStatus />
      <MainContent>
        <FirebaseStatus theme={theme}>
          {isFirebaseConnected ? "🔥 Real-time Firebase connection active" : "⚠️ Using API fallback mode"}
        </FirebaseStatus>

        {currentStatus.lastUpdate && (
          <LastUpdate theme={theme}>Last updated: {new Date(currentStatus.lastUpdate).toLocaleString()}</LastUpdate>
        )}

        <StatusGrid>
          <StatusCard
            title="Helmet Status"
            status={currentStatus.helmet}
            description={getStatusDescription("helmet", currentStatus.helmet)}
            icon={Shield}
          />
          <StatusCard
            title="Accident Detection"
            status={currentStatus.accident ? "accident" : "safe"}
            description={getStatusDescription("accident", currentStatus.accident)}
            icon={AlertTriangle}
          />
          <StatusCard
            title="Fatigue Level"
            status={currentStatus.fatigue}
            description={getStatusDescription("fatigue", currentStatus.fatigue)}
            icon={Zap}
          />
          <StatusCard
            title="Location Status"
            status={currentStatus.location ? "active" : "inactive"}
            description={currentStatus.location ? "GPS location is being tracked" : "GPS location unavailable"}
            icon={MapPin}
          />
        </StatusGrid>

        <MapSection>
          <MapComponent location={currentStatus.location} />
        </MapSection>

        <AlertLog />
      </MainContent>

      <SOSButton />
      <EmergencyModal />
    </AppContainer>
  )
}

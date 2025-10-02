"use client"
import styled, { keyframes } from "styled-components"
import { useTheme } from "../contexts/ThemeContext"
import { useAlert } from "../contexts/AlertContext"
import { AlertTriangle, X } from "lucide-react"

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 1rem;
`

const Modal = styled.div`
  background: ${(props) => props.theme.colors.surface};
  border-radius: 16px;
  padding: 2rem;
  max-width: 400px;
  width: 100%;
  text-align: center;
  animation: ${fadeIn} 0.3s ease;
  border: 2px solid ${(props) => props.theme.colors.error};
`

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  color: ${(props) => props.theme.colors.error};
`

const ModalTitle = styled.h2`
  color: ${(props) => props.theme.colors.error};
  margin: 0;
  font-size: 1.5rem;
  font-weight: bold;
`

const CountdownDisplay = styled.div`
  font-size: 3rem;
  font-weight: bold;
  color: ${(props) => props.theme.colors.error};
  margin: 1rem 0;
  font-family: 'Courier New', monospace;
`

const ModalMessage = styled.p`
  color: ${(props) => props.theme.colors.text};
  margin-bottom: 2rem;
  line-height: 1.5;
`

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
`

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;

  &:hover {
    transform: translateY(-2px);
  }
`

const CancelButton = styled(Button)`
  background: ${(props) => props.theme.colors.surface};
  color: ${(props) => props.theme.colors.text};
  border: 2px solid ${(props) => props.theme.colors.border};

  &:hover {
    background: ${(props) => props.theme.colors.background};
  }
`

const SOSButton = styled(Button)`
  background: ${(props) => props.theme.colors.error};
  color: white;

  &:hover {
    background: #c0392b;
  }
`

const EmergencyModal = () => {
  const theme = useTheme()
  const { isEmergency, emergencyCountdown, cancelEmergency, handleSOS } = useAlert()

  if (!isEmergency) return null

  return (
    <Overlay>
      <Modal theme={theme}>
        <ModalHeader theme={theme}>
          <AlertTriangle size={32} />
          <ModalTitle theme={theme}>EMERGENCY DETECTED</ModalTitle>
        </ModalHeader>

        <CountdownDisplay theme={theme}>{emergencyCountdown}</CountdownDisplay>

        <ModalMessage theme={theme}>
          An accident has been detected. Emergency services will be contacted automatically in {emergencyCountdown}{" "}
          seconds unless you cancel.
        </ModalMessage>

        <ButtonGroup>
          <CancelButton onClick={cancelEmergency} theme={theme}>
            <X size={16} style={{ marginRight: "0.5rem" }} />
            Cancel
          </CancelButton>
          <SOSButton onClick={handleSOS} theme={theme}>
            Send SOS Now
          </SOSButton>
        </ButtonGroup>
      </Modal>
    </Overlay>
  )
}

export default EmergencyModal

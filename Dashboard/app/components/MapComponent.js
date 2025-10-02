"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import styled from "styled-components"
import { useTheme } from "../contexts/ThemeContext"

// Dynamically import map components to avoid SSR issues
const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false })
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false })
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false })

const MapWrapper = styled.div`
  background: ${(props) => props.theme.colors.surface};
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border: 1px solid ${(props) => props.theme.colors.border};
  height: 400px;
  position: relative;

  .leaflet-container {
    height: 100%;
    width: 100%;
  }

  .leaflet-popup-content-wrapper {
    background: ${(props) => props.theme.colors.surface};
    color: ${(props) => props.theme.colors.text};
    border-radius: 8px;
  }

  .leaflet-popup-tip {
    background: ${(props) => props.theme.colors.surface};
  }
`

const MapHeader = styled.div`
  background: ${(props) => props.theme.colors.background};
  padding: 1rem;
  border-bottom: 1px solid ${(props) => props.theme.colors.border};
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
`

const MapTitle = styled.h3`
  color: ${(props) => props.theme.colors.text};
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
`

const MapContent = styled.div`
  height: 100%;
  padding-top: 60px;
`

const LoadingMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: ${(props) => props.theme.colors.textSecondary};
  font-size: 0.9rem;
  background: ${(props) => props.theme.colors.surface};
`

// Default center (Delhi, India)
const defaultCenter = [28.6139, 77.209]

const MapComponent = ({ location }) => {
  const theme = useTheme()
  const [isClient, setIsClient] = useState(false)
  const [leafletLoaded, setLeafletLoaded] = useState(false)

  useEffect(() => {
    setIsClient(true)

    // Load Leaflet CSS
    if (typeof window !== "undefined") {
      import("leaflet/dist/leaflet.css")
      import("leaflet").then((L) => {
        // Fix for default markers
        delete L.Icon.Default.prototype._getIconUrl
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
          iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
          shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
        })
        setLeafletLoaded(true)
      })
    }
  }, [])

  const currentLocation = location ? [location.lat, location.lng] : defaultCenter

  // Custom marker icon
  const createCustomIcon = () => {
    if (typeof window === "undefined") return null

    return new window.L.divIcon({
      html: `
        <div style="
          width: 30px;
          height: 30px;
          background: ${theme.colors.primary};
          border: 3px solid white;
          border-radius: 50%;
          box-shadow: 0 2px 10px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <div style="
            width: 12px;
            height: 12px;
            background: white;
            border-radius: 50%;
          "></div>
        </div>
      `,
      className: "custom-marker",
      iconSize: [30, 30],
      iconAnchor: [15, 15],
    })
  }

  if (!isClient || !leafletLoaded) {
    return (
      <MapWrapper theme={theme}>
        <MapHeader theme={theme}>
          <MapTitle theme={theme}>Live Location</MapTitle>
        </MapHeader>
        <LoadingMessage theme={theme}>Loading map...</LoadingMessage>
      </MapWrapper>
    )
  }

  return (
    <MapWrapper theme={theme}>
      <MapHeader theme={theme}>
        <MapTitle theme={theme}>Live Location</MapTitle>
      </MapHeader>
      <MapContent>
        <MapContainer
          center={currentLocation}
          zoom={15}
          style={{ height: "100%", width: "100%" }}
          zoomControl={true}
          scrollWheelZoom={true}
        >
          <TileLayer
            url={
              theme.isDark
                ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            }
            attribution={
              theme.isDark
                ? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }
          />
          <Marker position={currentLocation} icon={createCustomIcon()}>
            <Popup>
              <div style={{ color: theme.colors.text }}>
                <strong>Current Location</strong>
                <br />
                Lat: {currentLocation[0].toFixed(6)}
                <br />
                Lng: {currentLocation[1].toFixed(6)}
                <br />
                <small>Last updated: {new Date().toLocaleTimeString()}</small>
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      </MapContent>
    </MapWrapper>
  )
}

export default MapComponent

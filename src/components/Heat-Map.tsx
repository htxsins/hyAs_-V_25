"use client"

import { useEffect, useRef, useState } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/heatmapcard"

// Replace with your actual Mapbox access token
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
  

export default function HeatMap() {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const [lng] = useState(72.8777)
  const [lat] = useState(19.076)
  const [zoom] = useState(10)

  useEffect(() => {
    if (map.current) return // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current!,
      style: "mapbox://styles/mapbox/light-v10",
      center: [lng, lat],
      zoom: zoom,
    })

    map.current.on("load", () => {
      if (!map.current) return

      // Add heatmap layer
      map.current.addSource("heatmap-data", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [
            // Existing locations...
            {
              type: "Feature",
              properties: { intensity: 1 },
              geometry: { type: "Point", coordinates: [72.8562, 19.2307] },
            }, // Borivali
            {
              type: "Feature",
              properties: { intensity: 1 },
              geometry: { type: "Point", coordinates: [72.8074, 19.4558] },
            }, // Virar
            {
              type: "Feature",
              properties: { intensity: 1 },
              geometry: { type: "Point", coordinates: [73.1645, 19.2183] },
            }, // Ulhasnagar
            {
              type: "Feature",
              properties: { intensity: 0.7 },
              geometry: { type: "Point", coordinates: [72.8296, 18.9825] },
            }, // Mahalaxmi
            {
              type: "Feature",
              properties: { intensity: 0.7 },
              geometry: { type: "Point", coordinates: [72.8311, 19.0596] },
            }, // Bandra
            {
              type: "Feature",
              properties: { intensity: 0.7 },
              geometry: { type: "Point", coordinates: [72.8408, 19.0803] },
            }, // Santacruz
            {
              type: "Feature",
              properties: { intensity: 0.7 },
              geometry: { type: "Point", coordinates: [72.9726, 19.2183] },
            }, // Thane
            {
              type: "Feature",
              properties: { intensity: 0.4 },
              geometry: { type: "Point", coordinates: [72.8416, 19.0178] },
            }, // Dadar
            {
              type: "Feature",
              properties: { intensity: 0.4 },
              geometry: { type: "Point", coordinates: [72.8397, 19.0368] },
            }, // Mahim
            {
              type: "Feature",
              properties: { intensity: 0.4 },
              geometry: { type: "Point", coordinates: [72.8547, 19.2815] },
            }, // Mira Road
            {
              type: "Feature",
              properties: { intensity: 0.9 },
              geometry: { type: "Point", coordinates: [72.8777, 19.076] },
            }, // Mumbai City Center
            {
              type: "Feature",
              properties: { intensity: 0.8 },
              geometry: { type: "Point", coordinates: [72.8213, 19.1386] },
            }, // Andheri
            {
              type: "Feature",
              properties: { intensity: 0.4 },
              geometry: { type: "Point", coordinates: [72.9342, 19.159] },
            }, // Powai
            {
              type: "Feature",
              properties: { intensity: 0.7 },
              geometry: { type: "Point", coordinates: [72.8359, 18.9256] },
            }, // Colaba
            {
              type: "Feature",
              properties: { intensity: 0.7 },
              geometry: { type: "Point", coordinates: [72.8961, 19.0821] },
            }, // Ghatkopar
            {
              type: "Feature",
              properties: { intensity: 0.6 },
              geometry: { type: "Point", coordinates: [72.8479, 19.2147] },
            }, // Kandivali
            {
              type: "Feature",
              properties: { intensity: 0.5 },
              geometry: { type: "Point", coordinates: [72.8296, 19.0519] },
            }, // Worli
            {
              type: "Feature",
              properties: { intensity: 0.4 },
              geometry: { type: "Point", coordinates: [72.813, 19.2183] },
            }, // Goregaon
            // New locations with varying intensities
            {
              type: "Feature",
              properties: { intensity: 1 },
              geometry: { type: "Point", coordinates: [72.8776, 19.2335] },
            }, // Dahisar (Dark Purple)
            {
              type: "Feature",
              properties: { intensity: 1 },
              geometry: { type: "Point", coordinates: [72.952, 19.1759] },
            }, // Mulund (Dark Purple)
            {
              type: "Feature",
              properties: { intensity: 1 },
              geometry: { type: "Point", coordinates: [72.8861, 19.0453] },
            }, // Chembur (Dark Purple)
            {
              type: "Feature",
              properties: { intensity: 0.7 },
              geometry: { type: "Point", coordinates: [72.8369, 19.1136] },
            }, // Jogeshwari (Medium Purple)
            {
              type: "Feature",
              properties: { intensity: 0.7 },
              geometry: { type: "Point", coordinates: [72.8841, 19.0748] },
            }, // Kurla (Medium Purple)
            {
              type: "Feature",
              properties: { intensity: 0.7 },
              geometry: { type: "Point", coordinates: [72.8353, 18.9977] },
            }, // Parel (Medium Purple)
            {
              type: "Feature",
              properties: { intensity: 0.4 },
              geometry: { type: "Point", coordinates: [72.8465, 19.2664] },
            }, // Bhayander (Light Purple)
            {
              type: "Feature",
              properties: { intensity: 0.4 },
              geometry: { type: "Point", coordinates: [72.9141, 19.1975] },
            }, // Bhandup (Light Purple)
          ],
        },
      })

      map.current.addLayer({
        id: "heatmap-layer",
        type: "heatmap",
        source: "heatmap-data",
        paint: {
          "heatmap-weight": ["get", "intensity"],
          "heatmap-intensity": 1,
          "heatmap-color": [
            "interpolate",
            ["linear"],
            ["heatmap-density"],
            0,
            "rgba(128,0,128,0)",
            0.2,
            "rgba(199,21,133,0.5)",
            0.4,
            "rgba(159,0,197,0.67)",
            0.6,
            "rgba(139,0,139,0.83)",
            0.8,
            "rgba(128,0,128,0.91)",
            1,
            "rgba(75,0,130,1)",
          ],
          "heatmap-radius": 32,
          "heatmap-opacity": 0.8,
        },
      })

      // Add a marker for Thadomal Shahani Engineering College
      new mapboxgl.Marker({ color: "#FF0000" })
        .setLngLat([72.8367, 19.0722])
        .setPopup(new mapboxgl.Popup().setHTML("<h3>Thadomal Shahani Engineering College</h3>"))
        .addTo(map.current)
    })
  }, [lng, lat, zoom])

  return (
    <Card className="m-4">
      <CardHeader>
        <CardTitle>Mumbai HeatMap</CardTitle>
        <CardDescription>Depicting Intensity Of The Locations From Where Students Travel</CardDescription>
      </CardHeader>
      <CardContent>
        <div ref={mapContainer} className="w-full h-[600px] rounded-lg shadow-lg" />
        <div className="mt-4 flex items-center justify-center space-x-4">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-purple-950 mr-2"></div>
            <span>Dark Purple (60%)</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-purple-700 mr-2"></div>
            <span>Purple (30%)</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-purple-400 mr-2"></div>
            <span>Light Purple (10%)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}


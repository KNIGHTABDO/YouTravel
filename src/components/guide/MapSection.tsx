'use client';

import { useEffect, useRef } from 'react';
import { MapLocation } from '@/types';

interface MapSectionProps {
  locations: MapLocation[];
  center?: { lat: number; lng: number };
  zoom?: number;
}

export function MapSection({ locations, center, zoom = 6 }: MapSectionProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !mapRef.current) return;

    // Dynamically import Leaflet
    const initMap = async () => {
      // @ts-ignore - Leaflet is loaded dynamically
      const L = (await import('leaflet')).default;
      
      // Import Leaflet CSS
      if (!document.querySelector('link[href*="leaflet"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }

      // Clean up previous map
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }

      // Calculate center from locations if not provided
      const mapCenter = center || (locations.length > 0 
        ? { 
            lat: locations.reduce((sum, l) => sum + l.coordinates.lat, 0) / locations.length,
            lng: locations.reduce((sum, l) => sum + l.coordinates.lng, 0) / locations.length
          }
        : { lat: 0, lng: 0 });

      // Initialize map
      const map = L.map(mapRef.current!).setView([mapCenter.lat, mapCenter.lng], zoom);
      mapInstanceRef.current = map;

      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(map);

      // Custom icons
      const createIcon = (type: string) => {
        const colors: Record<string, string> = {
          city: '#ea580c',
          attraction: '#2563eb',
          neighborhood: '#16a34a',
          airport: '#7c3aed',
        };
        
        return L.divIcon({
          className: 'custom-marker',
          html: `<div style="
            background-color: ${colors[type] || '#ea580c'};
            width: 24px;
            height: 24px;
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          "></div>`,
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        });
      };

      // Add markers
      locations.forEach(location => {
        const marker = L.marker(
          [location.coordinates.lat, location.coordinates.lng],
          { icon: createIcon(location.type) }
        ).addTo(map);

        marker.bindPopup(`
          <div style="padding: 8px; min-width: 150px;">
            <strong style="font-size: 14px;">${location.name}</strong>
            ${location.description ? `<p style="margin: 4px 0 0 0; font-size: 12px; color: #666;">${location.description}</p>` : ''}
          </div>
        `);
      });

      // Fit bounds if multiple locations
      if (locations.length > 1) {
        const bounds = L.latLngBounds(
          locations.map(l => [l.coordinates.lat, l.coordinates.lng] as [number, number])
        );
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    };

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [locations, center, zoom]);

  return (
    <div className="mb-16">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
          <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
        </div>
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">Interactive Map</h2>
          <p className="text-muted-foreground">Explore key locations and plan your route</p>
        </div>
      </div>

      <div 
        ref={mapRef} 
        className="w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-lg border border-card-border"
        style={{ zIndex: 0 }}
      />

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-[#ea580c]"></div>
          <span className="text-sm text-muted-foreground">Cities</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-[#2563eb]"></div>
          <span className="text-sm text-muted-foreground">Attractions</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-[#16a34a]"></div>
          <span className="text-sm text-muted-foreground">Neighborhoods</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-[#7c3aed]"></div>
          <span className="text-sm text-muted-foreground">Airports</span>
        </div>
      </div>
    </div>
  );
}

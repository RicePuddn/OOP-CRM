// components/CustomerClusterMap.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useJsApiLoader } from "@react-google-maps/api";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import { motion } from "framer-motion";

interface CustomerLocation {
  cid: number;
  cID: number;
  zipcode: string;
  lat: number;
  lng: number;
}

const CustomerClusterMap: React.FC = () => {
  const [customerLocations, setCustomerLocations] = useState<
    CustomerLocation[]
  >([]);
  const mapRef = useRef<HTMLDivElement>(null);

  // Get the API key from environment variables
  const apiKey = "AIzaSyB8YSXNlPjKzq0QdY4-w08HOe4_QJd2WO0";

  // Load the Google Maps JavaScript API
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: apiKey,
    libraries: ["places", "geometry"],
  });

  useEffect(() => {
    const fetchCustomerZipcodes = async () => {
      try {
        // Step 1: Fetch customer zipcodes from the backend API
        const response = await axios.get(
          "http://localhost:8080/api/customers/zipcodes"
        );
        const customers: CustomerLocation[] = response.data;
        // Step 2: Convert zipcodes to latitude and longitude using Google Geocoding API
        const geocodePromises = customers.map((customer) =>
          geocodePostalCode(customer.zipcode, customer.cid)
        );
        const locations = await Promise.all(geocodePromises);

        // Step 3: Filter out invalid locations (e.g., entries that could not be geocoded)
        const validLocations = locations.filter(
          (loc) => loc !== null
        ) as CustomerLocation[];

        setCustomerLocations(validLocations);
      } catch (error) {
        console.error("Error fetching customer zipcodes:", error);
      }
    };

    fetchCustomerZipcodes();
  }, []);

  const geocodePostalCode = async (
    postalCode: string,
    cID: number
  ): Promise<CustomerLocation | null> => {
    try {
      if (!postalCode || postalCode.trim() === "") {
        return null; // Ignore blank postal codes
      }

      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${postalCode},Singapore&key=${apiKey}`
      );
      if (response.data.results.length > 0) {
        const location = response.data.results[0].geometry.location;
        return {
          cid: cID,
          cID,
          zipcode: postalCode,
          lat: location.lat,
          lng: location.lng,
        };
      }
      return null; // Return null if no geocoding results are found
    } catch (error) {
      console.error(`Error geocoding postal code ${postalCode}:`, error);
      return null;
    }
  };

  useEffect(() => {
    if (isLoaded && customerLocations.length > 0) {
      initMap();
    }
  }, [isLoaded, customerLocations]);

  const initMap = () => {
    if (!mapRef.current) return;

    // Initialize the map
    const map = new google.maps.Map(mapRef.current, {
      zoom: 11,
      center: { lat: 1.3521, lng: 103.8198 }, // Singapore center
    });

    // InfoWindow for displaying marker details
    const infoWindow = new google.maps.InfoWindow({
      content: "",
      disableAutoPan: true,
    });

    // Add some markers to the map.
    const markers = customerLocations.map((position) => {
      const marker = new google.maps.Marker({
        position: { lat: position.lat, lng: position.lng },
        map,
      });

      // Open info window when marker is clicked
      marker.addListener("click", () => {
        infoWindow.setContent(
          `Customer ID: ${position.cID}<br>Lat: ${position.lat}, Lng: ${position.lng}`
        );
        infoWindow.open(map, marker);
      });

      return marker;
    });

    // Add a marker clusterer to manage the markers.
    new MarkerClusterer({ markers, map });
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-semibold text-gray-600">Loading Map...</p>
      </div>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{
        opacity: 1,
        scale: 1,
        transition: { duration: 0.5 },
      }}
    >
      <div className="flex flex-col w-full h-screen p-4 bg-gray-100">
        <div
          className="w-full h-1/2 rounded-lg overflow-hidden shadow-lg border-2 border-green-700"
          id="map-container"
          ref={mapRef}
        ></div>
        <div className="w-full h-1/2 p-4">
          <p className="text-center text-lg font-semibold">
            Customer Heat Map Details
          </p>
        </div>
      </div>
    </motion.section>
  );
};

export default CustomerClusterMap;

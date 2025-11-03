import { useState, useEffect, useRef } from 'react';
// import { generateMockPacket, generateInitialMockData } from '../mockData';
import staticData from '../temp.json';

// WebSocket hook with fallback to static data
export const useWebSocket = (url = 'ws://localhost:8765') => {
//   const [packets, setPackets] = useState(generateInitialMockData(50));
  const [packets, setPackets] = useState(staticData);
  const [isConnected, setIsConnected] = useState(false);
//   const [connectionStatus, setConnectionStatus] = useState('connecting');
  const [connectionStatus, setConnectionStatus] = useState('using static data');
  const wsRef = useRef(null);
//   const mockIntervalRef = useRef(null);

  useEffect(() => {
    // Load static data on mount
    setPackets(staticData);
    console.log('Using static data from temp.json');

    // Try to connect to WebSocket (optional, for future use)
    try {
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        setConnectionStatus('connected');
        // Clear mock data interval if it was running
        // if (mockIntervalRef.current) {
        //   clearInterval(mockIntervalRef.current);
        // }
      };

      ws.onmessage = (event) => {
        try {
          const newPackets = JSON.parse(event.data);
          if (Array.isArray(newPackets)) {
            setPackets(prev => [...newPackets, ...prev].slice(0, 200));
          } else {
            setPackets(prev => [newPackets, ...prev].slice(0, 200));
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

    //   ws.onerror = (error) => {
    //     console.log('WebSocket error, using mock data instead');
    //     setIsConnected(false);
    //     setConnectionStatus('using mock data');
    //     startMockDataGeneration();
    //   };
      ws.onerror = () => {
        console.log('WebSocket error, using static data');
        setIsConnected(false);
        setConnectionStatus('using static data');
      };

      ws.onclose = () => {
        console.log('WebSocket disconnected, using static data');
        setIsConnected(false);
        setConnectionStatus('using static data');
        // startMockDataGeneration();
      };
    } catch (error) {
      console.log('WebSocket connection failed, using static data');
      setIsConnected(false);
      setConnectionStatus('using static data');
    //   startMockDataGeneration();
    }

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    //   if (mockIntervalRef.current) {
    //     clearInterval(mockIntervalRef.current);
    //   }
    };
  }, [url]);

//   const startMockDataGeneration = () => {
//     if (!mockIntervalRef.current) {
//       mockIntervalRef.current = setInterval(() => {
//         const newPacket = generateMockPacket();
//         setPackets(prev => [newPacket, ...prev].slice(0, 200));
//       }, 2000);
//     }
//   };

  return { packets, isConnected, connectionStatus };
};


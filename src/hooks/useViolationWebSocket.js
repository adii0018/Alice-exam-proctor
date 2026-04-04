import { useEffect, useRef, useState, useCallback } from 'react';
import toast from 'react-hot-toast';

/**
 * WebSocket hook for receiving live violation alerts
 * Used by teachers to monitor violations in real-time
 */
export const useViolationWebSocket = ({ enabled = true, onViolation = null } = {}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [liveViolations, setLiveViolations] = useState([]);
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const reconnectAttemptsRef = useRef(0);

  const connect = useCallback(() => {
    if (!enabled) return;

    try {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      
      if (!token || !userStr) {
        console.warn('[WebSocket] No auth token or user found');
        return;
      }

      const user = JSON.parse(userStr);
      const teacherId = user._id || user.id;

      if (!teacherId) {
        console.warn('[WebSocket] No teacher ID found');
        return;
      }

      // Get WebSocket URL from environment or default
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const wsUrl = apiUrl.replace('http://', 'ws://').replace('https://', 'wss://').replace('/api', '');
      const url = `${wsUrl}/ws/teacher/monitor/${teacherId}/?token=${token}`;

      console.log('[WebSocket] Connecting to:', url);
      const ws = new WebSocket(url);

      ws.onopen = () => {
        console.log('[WebSocket] Connected successfully');
        setIsConnected(true);
        reconnectAttemptsRef.current = 0;
        
        // Send ping to keep connection alive
        const pingInterval = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: 'ping' }));
          }
        }, 30000); // Every 30 seconds

        ws.pingInterval = pingInterval;
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('[WebSocket] Received:', data);

          if (data.type === 'VIOLATION_ALERT') {
            const violation = data.violation;
            
            // Add to live violations list
            setLiveViolations(prev => [violation, ...prev].slice(0, 50));
            
            // Show toast notification
            toast.error(
              `${violation.student_name}: ${violation.violation_type}`,
              {
                duration: 5000,
                icon: '⚠️',
              }
            );

            // Call custom handler if provided
            if (onViolation) {
              onViolation(violation);
            }
          } else if (data.type === 'connection_established') {
            console.log('[WebSocket] Connection confirmed:', data.message);
          } else if (data.type === 'pong') {
            // Ping response received
          }
        } catch (error) {
          console.error('[WebSocket] Error parsing message:', error);
        }
      };

      ws.onerror = (error) => {
        console.error('[WebSocket] Error:', error);
      };

      ws.onclose = (event) => {
        console.log('[WebSocket] Disconnected:', event.code, event.reason);
        setIsConnected(false);

        // Clear ping interval
        if (ws.pingInterval) {
          clearInterval(ws.pingInterval);
        }

        // Attempt to reconnect with exponential backoff
        if (enabled && reconnectAttemptsRef.current < 5) {
          const delay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 30000);
          console.log(`[WebSocket] Reconnecting in ${delay}ms...`);
          
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttemptsRef.current += 1;
            connect();
          }, delay);
        }
      };

      wsRef.current = ws;
    } catch (error) {
      console.error('[WebSocket] Connection error:', error);
    }
  }, [enabled, onViolation]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (wsRef.current) {
      if (wsRef.current.pingInterval) {
        clearInterval(wsRef.current.pingInterval);
      }
      wsRef.current.close();
      wsRef.current = null;
    }

    setIsConnected(false);
  }, []);

  const clearViolations = useCallback(() => {
    setLiveViolations([]);
  }, []);

  // Connect on mount, disconnect on unmount
  useEffect(() => {
    connect();
    return () => disconnect();
  }, [connect, disconnect]);

  return {
    isConnected,
    liveViolations,
    clearViolations,
    reconnect: connect,
  };
};

export default useViolationWebSocket;

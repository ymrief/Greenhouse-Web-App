// API Service untuk Smart Greenhouse Frontend
// Menangani semua komunikasi dengan Backend

import axios from 'axios';

// ==================== CONFIGURATION ====================
const API_BASE_URL =
    import.meta.env?.VITE_API_URL || 'http://localhost:8080';
const WEBSOCKET_URL =
    import.meta.env?.VITE_WS_URL || 'ws://localhost:8080/ws';

// Create axios instance
export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 30000,
});

// ==================== DEVICE ENDPOINTS ====================
export const deviceAPI = {
    /**
     * Get all devices grouped by type
     * @returns {Promise} { soil: [...], limit: [...], dht: [...], bh: [...] }
     */
    getAllDevices: () => apiClient.get('/api/devices'),

    /**
     * Get comprehensive device summary
     * @returns {Promise} Device summary with latest readings
     */
    getDeviceSummary: () => apiClient.get('/api/device-summary'),

    /**
     * Get sensor data
     * @returns {Promise} Latest sensor readings
     */
    getSensorData: () => apiClient.get('/sensor'),
};

// ==================== RECORDS ENDPOINTS ====================
export const recordsAPI = {
    /**
     * Mengambil riwayat data sensor yang sudah rapi dari PostgreSQL Backend
     * @param {number} limit - Jumlah baris data yang ingin diambil
     */
    getHistory: (limit = 50) =>
        apiClient.get('/api/preprocessed', { params: { limit } }),
};

// ==================== MOTOR CONTROL ENDPOINTS ====================
export const motorAPI = {
    /**
     * Move motor to checkpoint
     * @param {string} target - 'home' | '1' | '2' | '3' | 'end'
     * @returns {Promise}
     */
    moveToCheckpoint: (target) => apiClient.post('/control/slider', { target }),

    /**
     * Send manual motor command
     * @param {string} command - e.g., 'move_to_1', 'move_to_home'
     * @returns {Promise}
     */
    sendManualCommand: (command) =>
        apiClient.post('/manual/command', { command }),
};

// ==================== RELAY CONTROL ENDPOINTS ====================
export const relayAPI = {
    /**
     * Control solenoid valve
     * @param {string} target - '1' or '2'
     * @param {string} action - 'on' or 'off'
     * @returns {Promise}
     */
    controlSolenoid: (target, action) =>
        apiClient.post('/control/solenoid', { target, action }),

    /**
     * Control pump
     * @param {string} action - 'on' or 'off'
     * @returns {Promise}
     */
    controlPompa: (action) => apiClient.post('/control/pompa', { action }),
};

// ==================== AUTO WATERING ====================
export const wateringAPI = {
    /**
     * Run automatic watering sequence
     * @returns {Promise}
     */
    runAutoWatering: () => apiClient.post('/auto/run'),
};

// ==================== DEVICE GROUPS ====================
export const DEVICE_GROUPS = {
    MOTOR_CONTROLLER: 'esp_greenhouse_1',
    RELAY_CONTROLLER: 'esp_greenhouse_2',
    SENSOR_HUB: 'esp_greenhouse_3',
};

// ==================== MOTOR CHECKPOINTS ====================
export const MOTOR_CHECKPOINTS = {
    HOME: 'home',
    CHECKPOINT_1: '1',
    CHECKPOINT_2: '2',
    CHECKPOINT_3: '3',
    END: 'end',
};

export const CHECKPOINT_LABELS = {
    home: 'Home Position',
    1: 'Checkpoint 1',
    2: 'Checkpoint 2',
    3: 'Checkpoint 3',
    end: 'End Position',
};

// ==================== RELAY TARGETS ====================
export const RELAY_TARGETS = {
    SOLENOID_1: '1',
    SOLENOID_2: '2',
    SELENOID_1: '1', // Alias
    SELENOID_2: '2', // Alias
};

export const RELAY_LABELS = {
    1: 'Solenoid 1 (Selenoid)',
    2: 'Solenoid 2 (Selenoid)',
    pompa: 'Pump (Pompa)',
};

// ==================== RELAY ACTIONS ====================
export const RELAY_ACTIONS = {
    ON: 'on',
    OFF: 'off',
};

// ==================== MANUAL COMMANDS ====================
export const MANUAL_COMMANDS = {
    POMPA_ON: 'pompa_on',
    POMPA_OFF: 'pompa_off',
    SOLENOID_1_ON: 'solenoid_1_on',
    SOLENOID_1_OFF: 'solenoid_1_off',
    SOLENOID_2_ON: 'solenoid_2_on',
    SOLENOID_2_OFF: 'solenoid_2_off',
    MOVE_TO_HOME: 'move_to_home',
    MOVE_TO_1: 'move_to_1',
    MOVE_TO_2: 'move_to_2',
    MOVE_TO_3: 'move_to_3',
};

// ==================== SENSOR TYPES ====================
export const SENSOR_TYPES = {
    SOIL_MOISTURE: 'soil_moisture',
    HUMIDITY: 'humidity',
    TEMPERATURE: 'temperature',
    LIGHT: 'light',
    WATER_FLOW: 'water_flow',
    LIMIT_SWITCH: 'limit_switch',
};

// ==================== SENSOR UNITS ====================
export const SENSOR_UNITS = {
    PERCENTAGE: '%',
    CELSIUS: '°C',
    LUX: 'lux',
    LPM: 'L/min',
    BINARY: 'binary',
};

// ==================== ERROR HANDLING ====================
export const handleAPIError = (error) => {
    if (error.response) {
        // Server responded with error status
        return {
            status: error.response.status,
            message:
                error.response.data?.detail ||
                error.response.data?.message ||
                'Error',
        };
    } else if (error.request) {
        // Request made but no response
        return {
            status: 0,
            message: 'No response from server. Check if backend is running.',
        };
    } else {
        // Error in request setup
        return {
            status: -1,
            message: error.message || 'Unknown error',
        };
    }
};

// ==================== RESPONSE HANDLERS ====================
export const parseActuatorResponse = (response) => {
    return {
        status: response.status,
        device: response.device,
        action: response.action,
        target: response.target,
        commandId: response.command_id,
        timestamp: new Date().toISOString(),
    };
};

export const parseSensorResponse = (response) => {
    return {
        soil: response.soil || {},
        temperature: response.suhu || 0,
        humidity: response.kelembapan || 0,
        limitSwitches: {
            home: response.home || false,
            checkpoint1: response.checkpoint_1 || false,
            checkpoint2: response.checkpoint_2 || false,
            checkpoint3: response.checkpoint_3 || false,
        },
        timestamp: new Date().toISOString(),
    };
};

// ==================== WEBSOCKET CONNECTION ====================
export class WebSocketClient {
    constructor(url = WEBSOCKET_URL) {
        this.url = url;
        this.ws = null;
        this.listeners = {};
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.reconnectInterval = 3000;
    }

    connect() {
        return new Promise((resolve, reject) => {
            try {
                this.ws = new WebSocket(this.url);

                this.ws.onopen = () => {
                    console.log('[WS] Connected to server');
                    this.reconnectAttempts = 0;
                    this.emit('connected', null);
                    resolve(this);
                };

                this.ws.onmessage = (event) => {
                    try {
                        const data = JSON.parse(event.data);
                        console.log('[WS] Received:', data);
                        this.emit('message', data);
                    } catch (e) {
                        console.error('[WS] Failed to parse message:', e);
                    }
                };

                this.ws.onerror = (error) => {
                    console.error('[WS] Error:', error);
                    this.emit('error', error);
                    reject(error);
                };

                this.ws.onclose = () => {
                    console.log('[WS] Disconnected');
                    this.emit('disconnected', null);
                    this.attemptReconnect();
                };
            } catch (error) {
                reject(error);
            }
        });
    }

    attemptReconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            console.log(
                `[WS] Reconnecting... Attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts}`,
            );
            setTimeout(() => this.connect(), this.reconnectInterval);
        } else {
            console.log('[WS] Max reconnection attempts reached');
            this.emit('maxReconnectAttemptsExceeded', null);
        }
    }

    disconnect() {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
    }

    send(data) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(data));
        } else {
            console.warn('[WS] WebSocket is not connected');
        }
    }

    on(event, callback) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback);
    }

    off(event, callback) {
        if (this.listeners[event]) {
            this.listeners[event] = this.listeners[event].filter(
                (listener) => listener !== callback,
            );
        }
    }

    emit(event, data) {
        if (this.listeners[event]) {
            this.listeners[event].forEach((callback) => callback(data));
        }
    }

    isConnected() {
        return this.ws && this.ws.readyState === WebSocket.OPEN;
    }
}

// ==================== DEFAULTS ====================
export default {
    apiClient,
    deviceAPI,
    recordsAPI,
    motorAPI,
    relayAPI,
    wateringAPI,
    WebSocketClient,
    DEVICE_GROUPS,
    MOTOR_CHECKPOINTS,
    RELAY_TARGETS,
    MANUAL_COMMANDS,
    SENSOR_TYPES,
    handleAPIError,
};

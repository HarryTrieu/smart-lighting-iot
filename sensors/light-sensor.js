const mqtt = require('mqtt');

class LightSensor {
    constructor(sensorId, roomId) {
        this.sensorId = sensorId;
        this.roomId = roomId;
        this.client = mqtt.connect('mqtt://localhost:1883');
        
        this.client.on('connect', () => {
            console.log(`Light sensor ${sensorId} connected to MQTT`);
            this.startSending();
        });
    }
    
    startSending() {
        setInterval(() => {
            const currentHour = new Date().getHours();
            let lightLevel = 0;
            
            // Simulate natural light patterns
            if (currentHour >= 6 && currentHour <= 18) {
                // Daytime - simulate sun position
                const noon = 12;
                const distanceFromNoon = Math.abs(currentHour - noon);
                lightLevel = Math.max(0, 800 - (distanceFromNoon * 100)) + (Math.random() * 100);
            } else {
                // Nighttime - very low light
                lightLevel = Math.random() * 50;
            }
            
            const data = {
                deviceId: this.sensorId,
                roomId: this.roomId,
                timestamp: new Date().toISOString(),
                sensorType: 'light',
                value: Math.round(lightLevel),
                unit: 'lux',
                metadata: {
                    battery: Math.floor(Math.random() * 20) + 80,
                    signalStrength: Math.floor(Math.random() * 20) - 60
                }
            };
            
            this.client.publish(`sensors/${this.roomId}/light`, JSON.stringify(data));
            console.log(`Light sensor ${this.sensorId}: ${lightLevel.toFixed(0)} lux`);
        }, 5000);
    }
}

// Create light sensors for rooms
const livingRoomLight = new LightSensor('light_001', 'living_room');
const kitchenLight = new LightSensor('light_002', 'kitchen');
const bedroomLight = new LightSensor('light_003', 'bedroom');

console.log('Light sensors started...');
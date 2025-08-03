const mqtt = require('mqtt');

class MotionSensor {
    constructor(sensorId, roomId) {
        this.sensorId = sensorId;
        this.roomId = roomId;
        this.client = mqtt.connect('mqtt://localhost:1883');
        this.isOccupied = false;
        
        this.client.on('connect', () => {
            console.log(`Motion sensor ${sensorId} connected to MQTT`);
            this.startSending();
        });
    }
    
    startSending() {
        setInterval(() => {
            // Simulate realistic motion patterns
            const currentHour = new Date().getHours();
            let occupancyProbability = 0.1; // Default low probability
            
            // Higher probability during active hours
            if (currentHour >= 7 && currentHour <= 9) occupancyProbability = 0.8; // Morning
            if (currentHour >= 17 && currentHour <= 22) occupancyProbability = 0.9; // Evening
            if (currentHour >= 12 && currentHour <= 13) occupancyProbability = 0.6; // Lunch
            
            this.isOccupied = Math.random() < occupancyProbability;
            
            const data = {
                deviceId: this.sensorId,
                roomId: this.roomId,
                timestamp: new Date().toISOString(),
                sensorType: 'motion',
                value: this.isOccupied,
                metadata: {
                    battery: Math.floor(Math.random() * 20) + 80, // 80-100%
                    signalStrength: Math.floor(Math.random() * 20) - 60 // -60 to -40 dBm
                }
            };
            
            this.client.publish(`sensors/${this.roomId}/motion`, JSON.stringify(data));
            console.log(`Motion sensor ${this.sensorId}: ${this.isOccupied ? 'Motion detected' : 'No motion'}`);
        }, 5000); // Send every 5 seconds
    }
}

// Create multiple sensors for different rooms
const livingRoomMotion = new MotionSensor('motion_001', 'living_room');
const kitchenMotion = new MotionSensor('motion_002', 'kitchen');
const bedroomMotion = new MotionSensor('motion_003', 'bedroom');

console.log('Motion sensors started...');
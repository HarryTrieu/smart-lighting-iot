const mqtt = require('mqtt');

class LoadTester {
    constructor(numDevices) {
        this.numDevices = numDevices;
        this.devices = [];
        this.client = mqtt.connect('mqtt://localhost:1883');
        
        this.client.on('connect', () => {
            console.log(`Load tester connected. Creating ${numDevices} devices...`);
            this.createDevices();
        });
    }
    
    createDevices() {
        for (let i = 0; i < this.numDevices; i++) {
            const device = {
                id: `load_device_${i}`,
                roomId: `room_${i % 10}`, // 10 rooms max
                type: i % 2 === 0 ? 'motion' : 'light'
            };
            
            this.devices.push(device);
            this.startDevice(device);
        }
    }
    
    startDevice(device) {
        setInterval(() => {
            let value;
            if (device.type === 'motion') {
                value = Math.random() > 0.7; // 30% chance of motion
            } else {
                value = Math.floor(Math.random() * 1000); // 0-1000 lux
            }
            
            const data = {
                deviceId: device.id,
                roomId: device.roomId,
                timestamp: new Date().toISOString(),
                sensorType: device.type,
                value: value,
                metadata: {
                    battery: Math.floor(Math.random() * 20) + 80,
                    signalStrength: Math.floor(Math.random() * 20) - 60
                }
            };
            
            this.client.publish(`sensors/${device.roomId}/${device.type}`, JSON.stringify(data));
        }, Math.random() * 10000 + 5000); // Random interval 5-15 seconds
    }
}

// Start with 100 devices
const tester = new LoadTester(100);
console.log('Load testing started...');
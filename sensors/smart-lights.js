const mqtt = require('mqtt');

class SmartLight {
    constructor(lightId, roomId) {
        this.lightId = lightId;
        this.roomId = roomId;
        this.client = mqtt.connect('mqtt://localhost:1883');
        this.brightness = 0; // 0-100
        this.isOn = false;
        this.color = 'warm_white'; // warm_white, cool_white, rgb
        
        this.client.on('connect', () => {
            console.log(`Smart light ${lightId} connected to MQTT`);
            this.subscribeToCommands();
            this.sendStatus();
        });
    }
    
    subscribeToCommands() {
        this.client.subscribe(`lights/${this.roomId}/commands`);
        this.client.on('message', (topic, message) => {
            if (topic === `lights/${this.roomId}/commands`) {
                this.handleCommand(JSON.parse(message.toString()));
            }
        });
    }
    
    handleCommand(command) {
        if (command.targetDevice === this.lightId || command.targetDevice === 'all') {
            switch (command.action) {
                case 'turn_on':
                    this.isOn = true;
                    this.brightness = command.brightness || 100;
                    break;
                case 'turn_off':
                    this.isOn = false;
                    this.brightness = 0;
                    break;
                case 'set_brightness':
                    this.brightness = command.brightness;
                    this.isOn = this.brightness > 0;
                    break;
                case 'set_color':
                    this.color = command.color;
                    break;
            }
            console.log(`Light ${this.lightId}: ${this.isOn ? 'ON' : 'OFF'} - Brightness: ${this.brightness}%`);
            this.sendStatus();
        }
    }
    
    sendStatus() {
        const status = {
            deviceId: this.lightId,
            roomId: this.roomId,
            timestamp: new Date().toISOString(),
            deviceType: 'smart_light',
            state: {
                isOn: this.isOn,
                brightness: this.brightness,
                color: this.color,
                energyUsage: this.isOn ? (this.brightness * 0.1) : 0 // Watts
            }
        };
        
        this.client.publish(`lights/${this.roomId}/status`, JSON.stringify(status));
    }
}

// Create smart lights for rooms
const livingRoomLight = new SmartLight('light_001', 'living_room');
const kitchenLight = new SmartLight('light_002', 'kitchen');
const bedroomLight = new SmartLight('light_003', 'bedroom');

console.log('Smart lights initialized...');
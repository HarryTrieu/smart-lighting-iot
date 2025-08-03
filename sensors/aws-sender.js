const AWS = require('aws-sdk');
const mqtt = require('mqtt');


AWS.config.update({
    region: 'ap-southeast-2' 
});

const dynamodb = new AWS.DynamoDB.DocumentClient();

class AWSIntegration {
    constructor() {
        this.client = mqtt.connect('mqtt://localhost:1883');
        this.client.on('connect', () => {
            console.log('AWS Integration connected to MQTT');
            this.subscribeToSensors();
        });
    }
    
    subscribeToSensors() {
        this.client.subscribe('sensors/+/+');
        this.client.on('message', (topic, message) => {
            this.sendToAWS(JSON.parse(message.toString()));
        });
    }
    
    async sendToAWS(sensorData) {
        try {
            // Save to DynamoDB
            const params = {
                TableName: 'SensorReadings',
                Item: {
                    deviceId: sensorData.deviceId,
                    timestamp: sensorData.timestamp,
                    roomId: sensorData.roomId,
                    sensorType: sensorData.sensorType,
                    value: sensorData.value,
                    metadata: sensorData.metadata
                }
            };
            
            await dynamodb.put(params).promise();
            console.log(`Sent to AWS: ${sensorData.deviceId} - ${sensorData.sensorType}`);
            
        } catch (error) {
            console.error('AWS Error:', error);
        }
    }
}

new AWSIntegration();
# Smart Home Lighting IoT System

## Overview
This project demonstrates a scalable IoT smart lighting system using Node.js, Node-RED, and AWS services.

## Architecture
- **Edge Layer**: Simulated sensors and smart lights
- **Fog Layer**: Node-RED processing
- **Cloud Layer**: AWS Lambda, DynamoDB, API Gateway

## Getting Started

### Prerequisites
- Node.js 18+
- AWS Account
- MQTT Broker (Mosquitto)

### Installation
1. Clone repository: `git clone https://github.com/HarryTrieu/smart-lighting-iot.git`
2. Install dependencies: `npm install`
3. Configure AWS credentials: `aws configure`

### Running the System
1. Start MQTT broker: `mosquitto`
2. Start Node-RED: `node-red`
3. Start sensors: `node sensors/motion-sensor.js`
4. Start AWS integration: `node sensors/aws-sender.js`

## Testing
Run load test: `node testing/load-
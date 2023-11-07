const amqp = require('amqplib');

const RABBITMQ_URL = process.env.RABBITMQ_URL;

async function publishUserEvent(eventType, userData) {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();
    const queue = 'user_events';

    await channel.assertQueue(queue, { durable: true });
    const eventMessage = JSON.stringify({ eventType, userData });
    channel.sendToQueue(queue, Buffer.from(eventMessage), { persistent: true });

    console.log(`Published ${eventType} event to queue`);
    await channel.close();
    await connection.close();
}

module.exports = { publishUserEvent };

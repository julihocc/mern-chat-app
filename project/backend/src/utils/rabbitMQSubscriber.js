const amqp = require('amqplib');

const RABBITMQ_URL = process.env.RABBITMQ_URL;

async function startEventSubscriber() {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();
    const queue = 'user_events';

    await channel.assertQueue(queue, { durable: true });
    console.log(`Subscriber connected to queue: ${queue}`);

    channel.consume(queue, (message) => {
        const event = JSON.parse(message.content.toString());
        console.log(`Received event: ${event.eventType}`);

        // Handle the event (e.g., create or update user in backend)
        // ...

        channel.ack(message);
    });
}

module.exports = { startEventSubscriber };

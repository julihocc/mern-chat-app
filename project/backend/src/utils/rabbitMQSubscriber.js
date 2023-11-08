const amqp = require('amqplib');
const User = require("../models/UserModel");

const RABBITMQ_URL = process.env.RABBITMQ_URL;

async function startEventSubscriber() {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();
    const queue = 'user_events';

    await channel.assertQueue(queue, { durable: true });
    console.log(`Subscriber connected to queue: ${queue}`);

    channel.consume(queue, async (message) => {
        const event = JSON.parse(message.content.toString());
        console.log(`Received event: ${event.eventType}`);

        // Handle the event
        try {
            if (event.eventType === 'UserCreated') {
                // Assuming event.userData contains the necessary user fields
                const newUser = new User(event.userData);
                await newUser.save();
            }
            if (event.eventType === 'UserUpdated') {
                // Assuming event.userData contains the updated user fields and an id
                await User.findByIdAndUpdate(event.userData.id, event.userData);
            }
            if (event.eventType === 'UsernameChanged') {
                const { oldUsername, newUsername } = event.userData;
                await User.findOneAndUpdate({username: oldUsername}, {$set: {username: newUsername}}, {new: true})
            }
            channel.ack(message);
        } catch (error) {
            console.error('Error handling event:', error);
            // Requeue the message for later if there was an error
            channel.nack(message);
        }
    });
}

module.exports = { startEventSubscriber };

export type RabbitMQConnection = {
  connection: amqp.Connection;
  channel: Channel;
};

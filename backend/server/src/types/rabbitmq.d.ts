export type RabbitMQConnection = {
  connection: amqp.Connection;
  channel: Channel;
};

export type QueuedQuestion = {
  userId: string;
  questionId: string;
};

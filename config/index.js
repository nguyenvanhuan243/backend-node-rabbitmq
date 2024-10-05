// const amqpUrl = "amqp://127.0.0.1:5672" // using docker
const amqpUrlCloud = "amqps://pjrzgkug:3aVtADCfGBZ5ODAxc9K0dOc9rjYeow_R@shrimp.rmq.cloudamqp.com/pjrzgkug";

const config = {
  NODE_PORT: 3343,
  RBMQ: {
    SERVER: amqpUrlCloud,
    EXCHANGE: {
      C_VALIDATE_JSON: 'binance_exchange',
      T_VALIDATE_JSON: 'topic_binance_exchange'
    },
    ROUTING: {
      C_VALIDATE_JSON: 'binance_exchange',
      T_VALIDATE_JSON: 'topic_binance_exchange'
    },
    QUEUE: {
      T_VALIDATE_JSON: 'topic_binance_exchange'
    }
  },
};

export default config;

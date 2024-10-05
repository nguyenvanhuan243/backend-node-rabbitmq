import express from 'express';
import { json } from 'express';
import config from './config/index.js';
import producer from './direct/producer.js';
import amqp from 'amqplib';

const APP = express();
const PORT = config.NODE_PORT;
let count = 0;

APP.use(json());

// Health check endpoint
APP.get('/', (req, res) => {
  res.status(200).send({
    code: 200,
    message: 'Service is healthy',
    data: {
      status: "success",
      timestamp: new Date()
    }
  });
});

APP.post('/api/v1/save', (req, res) => {
  count++;
  console.log('Request received - ', count);
  try {
    req.body = { name: 'api_c1 - ' + count, timestamp: new Date(), metric: false };
    const _payLoad = JSON.stringify(req.body);
    producer(config.RBMQ.EXCHANGE.C_VALIDATE_JSON, _payLoad, (err, success) => {
      if (err) {
        res.send(err);
      } else {
        res.status(200).send({
          code: 200,
          message: 'Data received',
          data: success
        });
      }
    });
  } catch (e) {
    res.status(400).send({
      code: 400,
      message: 'Bad request',
    });
  }
});

APP.post('/api/v1/delete', (req, res) => {
  const admin = amqp.connect(config.RBMQ.SERVER);
  admin.then((conn) => {
    // You can handle the connection here
  }).catch((err) => {
    console.error('Failed to connect to RabbitMQ', err);
    res.status(500).send({
      code: 500,
      message: 'Internal Server Error',
    });
  });
});

APP.listen(PORT, () => {
  console.log(`Node Server running at: http://localhost:${PORT}/`);
});

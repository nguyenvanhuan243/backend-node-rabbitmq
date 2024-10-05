import amqp from 'amqplib';
import CONFIG from '../config/index.js';

const publisher = (EXCHANGE, PAYLOAD, cb) => {
  try {
    const producer = amqp.connect(CONFIG.RBMQ.SERVER);
    producer.then(conn => {
      return conn.createConfirmChannel().then(ch => {
        ch.assertExchange(EXCHANGE, 'direct', {
          durable: true,
          autoDelete: false
        });
        
        // Assigning blank string to exchange is to use the default exchange, where queue name is the routing key
        ch.publish(
          '',
          CONFIG.RBMQ.ROUTING.T_VALIDATE_JSON,
          Buffer.from(PAYLOAD), // Updated to use Buffer.from directly
          { contentType: "text/plain" }, // Options as a separate argument
          (err, ok) => {
            if (err != null) {
              console.error("Error: failed to send message\n" + err);
              cb(err);
            } else {
              cb(null);
              conn.close();
              // console.log('<<OK>>', ok); // TODO: log!
            }
          }
        );
      });
    }).catch(err => {
      console.error('<<<<<< In then callback error => >>>>>> ', err);
      cb(err);
    });
  } catch (error) {
    console.error('<<<<<< In try catch callback error => >>>>>> ', error);
    cb(error);
  }
};

export default publisher;

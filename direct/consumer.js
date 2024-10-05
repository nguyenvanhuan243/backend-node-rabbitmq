import amqp from 'amqplib';
import domain from 'domain';
import CONFIG from '../config/index.js';

const dom = domain.create();
let consumer = null;

dom.on("error", relisten);
dom.run(listen);

function listen() {
  consumer = amqp.connect(CONFIG.RBMQ.SERVER);
  consumer.then(conn => {
    return conn.createChannel().then(ch => {
      console.log("#################################### Started consumer in successfully #################################################");
      ch.assertExchange(CONFIG.RBMQ.ROUTING.C_VALIDATE_JSON, "direct", { durable: true, autoDelete: false });
      
      // One-to-one messaging uses the default exchange, where queue name is the routing key
      /**
       * >>>> `exclusive` set to false; so that if consumer is down, the incoming message are in queue without deleting <<<<
       */
      ch.assertQueue(CONFIG.RBMQ.ROUTING.C_VALIDATE_JSON, { durable: true, autoDelete: false, exclusive: false });
      
      ch.consume(CONFIG.RBMQ.ROUTING.T_VALIDATE_JSON, message => {
        console.log(message.content.toString());
      }, { noAck: true });
    });
  }).catch(err => {
    console.error("Exception handled, reconnecting...\nDetail:\n" + err);
    setTimeout(listen, 5000);
  });
}

function relisten() {
  consumer.then(conn => {
    conn.close();
  });
  setTimeout(listen, 5000);
}

export default listen; // Optionally export the listen function if needed

var redis = require('redis'),
    port = 6379,
    host = '127.0.0.1',
    opts = {}, //opts={auth_pass:rds_pwd}
    client = redis.createClient(port,host,opts),
    subscriber = redis.createClient(),
    publisher  = redis.createClient();


    client.on('ready',function(res){
        console.log('ready');
    });
subscriber.on("message", function(channel, message) {
  console.log("Message '" + message + "' on channel '" + channel + "' arrived!")
});

subscriber.subscribe("test");

publisher.publish("test", "haaaaai");
publisher.publish("test", "kthxbai");
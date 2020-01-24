const oop = require("oop-node-common");

module.exports = new oop.Config({
    amqpAddress: "OOP_AMQP_ADDRESS",

    relayInputQ: "OOP_RELAY_INPUT_Q",
    exchangeName: "OOP_EXCHANGE_NAME",
    recursiveTemprQ: "OOP_RECURSIVE_TEMPR_Q",
    coreResponseQ: "OOP_CORE_RESPONSE_Q"
});

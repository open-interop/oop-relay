const oop = require("oop-node-common");

module.exports = new oop.Config({
    amqpAddress: "OOP_AMQP_ADDRESS",

    relayInputQ: "OOP_RELAY_INPUT_Q",
    exchangeName: "OOP_EXCHANGE_NAME",
    recursiveTemprQ: "OOP_RECURSIVE_TEMPR_Q",
    coreResponseQ: "OOP_CORE_RESPONSE_Q",
    endpointsExchange: "OOP_ENDPOINTS_EXCHANGE_NAME",
    endpointsQ: "OOP_ENDPOINT_Q",
    retryLimit: {
        name: "OOP_TRANSMISSION_RETRY_LIMIT",
        optional: true,
        default: 0,
    }
});

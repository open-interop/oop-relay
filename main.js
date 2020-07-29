module.exports = (broker, config, logger) => {
    broker.consume(config.relayInputQ, message => {
        const data = message.content;

        logger.info(`Relaying ${data.uuid}.`);

        broker.publish(config.exchangeName, config.coreResponseQ, data);

        if (data.tempr.response) {
            if (data.tempr.temprs) {
                const tempr = data.tempr;
                const children = tempr.temprs;
                delete tempr.temprs;

                for (const child of children) {
                    const toSend = { ...data };
                    toSend.tempr = child;
                    toSend.tempr.previous = tempr;

                    broker.publish(
                        config.exchangeName,
                        config.recursiveTemprQ,
                        toSend
                    );
                }
            }
        }
    });
};

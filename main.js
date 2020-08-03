module.exports = (broker, config, logger) => {
    broker.consume(config.relayInputQ, message => {
        const data = message.content;

        logger.info(`Relaying ${data.uuid}.`);

        const maxRetries = data.tempr.retryLimit || config.retryLimit;
        const retries = data.tempr.retries || 0;

        if (data.tempr.response.success || data.tempr.retries >= maxRetries) {
            broker.publish(config.exchangeName, config.coreResponseQ, data);

            if (data.tempr.temprs && data.tempr.temprs.length) {
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
        } else {
            data.tempr.retries = retries + 1;

            /* TODO: This logic is duplicated elsewhere, may need fixing. */
            broker.publish(
                config.endpointsExchangeName,
                `${config.endpointsQ}.${data.tempr.endpointType}`,
                data
            );
        }

    });
};

import test from "ava";

var main = require("./main");

const mockLogger = { info: () => {}, error: () => {} };

test("discard transmission", t => {
    t.plan(2);

    const published = [];

    return new Promise(resolve => {
        const broker = {
            consume: (queue, fn) => {
                fn({
                    content: {
                        uuid: "1234-123456-1234-1234",
                        tempr: {
                            template: {
                                foo: "bar"
                            },
                            temprs: [
                                {
                                    template: {
                                        bar: "baz"
                                    }
                                }
                            ],
                            response: {
                                success: true
                            }
                        },
                        device: {
                            id: 1
                        }
                    }
                });

                resolve();
            },
            publish: (exchange, queue, message) => {
                published.push(message);
            }
        };

        main(broker, {}, mockLogger);
    }).then(() => {
        t.is(published.length, 2);
        t.is(published[1].tempr.template.bar, "baz");
    });
});

test("Failing messages are retried", t => {
    t.plan(2);

    const published = [];

    let process = null;

    return new Promise(resolve => {
        const broker = {
            consume: (queue, fn) => {
                process = fn;

                resolve();
            },
            publish: (exchange, queue, message) => {
                published.push({ queue, message: { ...message } });
            }
        };

        main(
            broker,
            { retryLimit: 3, endpointsQ: "endpoints", coreResponseQ: "core" },
            mockLogger
        );
    })
        .then(async () => {
            await process({
                content: {
                    uuid: "1234-123456-1234-1234",
                    tempr: {
                        endpointType: "http",
                        template: { foo: "bar" },
                        temprs: [],
                        response: { success: false }
                    },
                    device: { id: 1 }
                }
            });

            await process({ content: published[0].message });
            await process({ content: published[1].message });
            await process({ content: published[2].message });
        })
        .then(() => {
            t.is(published.length, 4);

            t.deepEqual(
                published.map(v => v.queue),
                ["endpoints.http", "endpoints.http", "endpoints.http", "core"]
            );
        });
});

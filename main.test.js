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
                                foo: "bar",
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

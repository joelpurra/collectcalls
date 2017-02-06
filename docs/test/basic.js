/* global
JoelPurra:false,
QUnit:false,
*/

(function()
{
    "use strict";

    (function()
    {
        QUnit.module("Class");

        QUnit.test("Class exists", function(assert)
        {
            assert.expect(4);

            assert.notStrictEqual(typeof (JoelPurra.CollectCalls), "undefined", "Is undefined.");
            assert.strictEqual(typeof (JoelPurra.CollectCalls), "function", "Not a function.");
            assert.strictEqual(typeof (new JoelPurra.CollectCalls()), "object", "Not an object.");
            assert.ok((new JoelPurra.CollectCalls()) instanceof (JoelPurra.CollectCalls), "Not an instance of itself.");
        });
    }());

    (function()
    {
        QUnit.module("Constructor");

        QUnit.test("Constructor accepts zero arguments", function(assert)
        {
            assert.expect(1);

            var result = new JoelPurra.CollectCalls();

            assert.strictEqual(result.queue.length, 0);

            result.join();
        });

        QUnit.test("Constructor accepts empty queue", function(assert)
        {
            assert.expect(1);

            var queue = [],
                result = new JoelPurra.CollectCalls(queue);

            assert.strictEqual(result.queue.length, 0);

            result.join();
        });

        QUnit.test("Constructor accepts two arguments and does not start", function(assert)
        {
            assert.expect(5);

            function fncChange()
            {
                change = "has changed";
            }

            var change = "has not changed",
                queue = null,
                result = null;

            queue = [];

            queue.push(fncChange);

            assert.strictEqual(queue.length, 1);

            result = new JoelPurra.CollectCalls(queue, false);

            assert.strictEqual(result.queue.length, 1);
            assert.strictEqual(change, "has not changed");

            result.join();

            assert.strictEqual(result.queue.length, 0);
            assert.strictEqual(change, "has changed");
        });

        QUnit.test("Constructor accepts two arguments and starts", function(assert)
        {
            assert.expect(5);

            function fncChange()
            {
                change = "has changed";
            }

            var change = "has not changed",
                queue = null,
                result = null;

            queue = [];

            queue.push(fncChange);

            assert.strictEqual(queue.length, 1);

            result = new JoelPurra.CollectCalls(queue, true);

            assert.strictEqual(result.queue.length, 0);
            assert.strictEqual(change, "has changed");

            result.join();

            assert.strictEqual(result.queue.length, 0);
            assert.strictEqual(change, "has changed");
        });
    }());

    (function()
    {
        QUnit.module("Queue");

        QUnit.test("Can run one function twice", function(assert)
        {
            assert.expect(6);

            function fncIncrement()
            {
                counter += 1;
            }

            var counter = 0,
                queue = null,
                result = null;

            queue = [];

            queue.push(fncIncrement);
            queue.push(fncIncrement);

            assert.strictEqual(queue.length, 2);
            assert.strictEqual(counter, 0);

            result = new JoelPurra.CollectCalls(queue);

            assert.strictEqual(result.queue.length, 2);
            assert.strictEqual(counter, 0);

            result.join();

            assert.strictEqual(result.queue.length, 0);
            assert.strictEqual(counter, 2);
        });

        QUnit.test("Can run one function twice, before and after constructor", function(assert)
        {
            assert.expect(8);

            function fncIncrement()
            {
                counter += 1;
            }

            var counter = 0,
                queue = null,
                result = null;

            queue = [];

            queue.push(fncIncrement);

            assert.strictEqual(queue.length, 1);
            assert.strictEqual(counter, 0);

            result = new JoelPurra.CollectCalls(queue);

            assert.strictEqual(result.queue.length, 1);
            assert.strictEqual(counter, 0);

            result.push(fncIncrement);

            assert.strictEqual(result.queue.length, 2);
            assert.strictEqual(counter, 0);

            result.join();

            assert.strictEqual(result.queue.length, 0);
            assert.strictEqual(counter, 2);
        });

        QUnit.test("Can run one function thrice, before and after constructor and after join", function(assert)
        {
            assert.expect(10);

            function fncIncrement()
            {
                counter += 1;
            }

            var counter = 0,
                queue = null,
                result = null;

            queue = [];

            queue.push(fncIncrement);

            assert.strictEqual(queue.length, 1);
            assert.strictEqual(counter, 0);

            result = new JoelPurra.CollectCalls(queue);

            assert.strictEqual(result.queue.length, 1);
            assert.strictEqual(counter, 0);

            result.push(fncIncrement);

            assert.strictEqual(result.queue.length, 2);
            assert.strictEqual(counter, 0);

            result.join();

            assert.strictEqual(result.queue.length, 0);
            assert.strictEqual(counter, 2);

            result.push(fncIncrement);

            assert.strictEqual(result.queue.length, 0);
            assert.strictEqual(counter, 3);
        });

        QUnit.test("Constructor copies original queue", function(assert)
        {
            assert.expect(20);

            function fncIncrement()
            {
                counter += 1;
            }

            var counter = 0,
                queue = null,
                result = null;

            queue = [];

            queue.push(fncIncrement);

            assert.strictEqual(queue.length, 1);
            assert.strictEqual(counter, 0);

            result = new JoelPurra.CollectCalls(queue);

            assert.strictEqual(queue.length, 1);
            assert.strictEqual(result.queue.length, 1);
            assert.strictEqual(counter, 0);

            queue.push(fncIncrement);

            assert.strictEqual(queue.length, 2);
            assert.strictEqual(result.queue.length, 1);
            assert.strictEqual(counter, 0);

            result.push(fncIncrement);

            assert.strictEqual(queue.length, 2);
            assert.strictEqual(result.queue.length, 2);
            assert.strictEqual(counter, 0);

            result.join();

            assert.strictEqual(queue.length, 2);
            assert.strictEqual(result.queue.length, 0);
            assert.strictEqual(counter, 2);

            queue.push(fncIncrement);

            assert.strictEqual(queue.length, 3);
            assert.strictEqual(result.queue.length, 0);
            assert.strictEqual(counter, 2);

            result.push(fncIncrement);

            assert.strictEqual(queue.length, 3);
            assert.strictEqual(result.queue.length, 0);
            assert.strictEqual(counter, 3);
        });
    }());

    (function()
    {
        QUnit.module("Error handling");

        QUnit.test("Can ignore function errors", function(assert)
        {
            assert.expect(10);

            function fncIncrement()
            {
                counter += 1;
            }

            function fncError()
            {
                throw new Error("fncError");
            }

            var counter = 0,
                queue = null,
                result = null;

            queue = [];

            queue.push(fncIncrement);
            queue.push(fncError);
            queue.push(fncIncrement);

            assert.strictEqual(queue.length, 3);
            assert.strictEqual(counter, 0);

            result = new JoelPurra.CollectCalls(queue);

            assert.strictEqual(result.queue.length, 3);
            assert.strictEqual(counter, 0);

            result.push(fncIncrement);
            result.push(fncError);
            result.push(fncIncrement);

            assert.strictEqual(result.queue.length, 6);
            assert.strictEqual(counter, 0);

            result.join();

            assert.strictEqual(result.queue.length, 0);
            assert.strictEqual(counter, 4);

            result.push(fncIncrement);
            result.push(fncError);
            result.push(fncIncrement);

            assert.strictEqual(result.queue.length, 0);
            assert.strictEqual(counter, 6);
        });

        QUnit.test("Can add non-functions", function(assert)
        {
            assert.expect(10);

            function fncIncrement()
            {
                counter += 1;
            }

            var counter = 0,
                queue = null,
                result = null,
                notAFunction = 123456;

            queue = [];

            queue.push(fncIncrement);
            queue.push(notAFunction);
            queue.push(fncIncrement);

            assert.strictEqual(queue.length, 3);
            assert.strictEqual(counter, 0);

            result = new JoelPurra.CollectCalls(queue);

            assert.strictEqual(result.queue.length, 3);
            assert.strictEqual(counter, 0);

            result.push(fncIncrement);
            result.push(notAFunction);
            result.push(fncIncrement);

            assert.strictEqual(result.queue.length, 6);
            assert.strictEqual(counter, 0);

            result.join();

            assert.strictEqual(result.queue.length, 0);
            assert.strictEqual(counter, 4);

            result.push(fncIncrement);
            result.push(notAFunction);
            result.push(fncIncrement);

            assert.strictEqual(result.queue.length, 0);
            assert.strictEqual(counter, 6);
        });
    }());
}());

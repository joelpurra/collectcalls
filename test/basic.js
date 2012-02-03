/// <reference path="qunit/qunit/qunit.js" />
/// <reference path="../src/collectcalls.joelpurra.js" />

/*jslint vars: true, white: true, maxlen: 120*/
/*global JoelPurra, module, test, ok, strictEqual, notStrictEqual*/

String.prototype.withReadableLinebreaks = function ()
{
	return this.replace(/\n/g, "\\n");
};

(function ()
{
	"use strict";

	(function ()
	{
		module("Class");

		test("Class exists", 4, function ()
		{
			notStrictEqual(typeof (JoelPurra.CollectCalls), "undefined", "Is undefined.");
			strictEqual(typeof (JoelPurra.CollectCalls), "function", "Not a function.");
			strictEqual(typeof (new JoelPurra.CollectCalls()), "object", "Not an object.");
			ok((new JoelPurra.CollectCalls()) instanceof (JoelPurra.CollectCalls), "Not an instance of itself.");
		});

	} ());

	(function ()
	{
		module("Constructor");

		test("Constructor accepts zero arguments", 1, function ()
		{
			var result = new JoelPurra.CollectCalls();

			strictEqual(result.queue.length, 0);

			result.join();
		});

		test("Constructor accepts empty queue", 1, function ()
		{
			var queue = [];
			var result = new JoelPurra.CollectCalls(queue);

			strictEqual(result.queue.length, 0);

			result.join();
		});

		test("Constructor accepts two arguments and does not start", 5, function ()
		{
			var change = "has not changed";

			function fncChange()
			{
				change = "has changed";
			}

			var queue = [];

			queue.push(fncChange);

			strictEqual(queue.length, 1);

			var result = new JoelPurra.CollectCalls(queue, false);

			strictEqual(result.queue.length, 1);
			strictEqual(change, "has not changed");

			result.join();

			strictEqual(result.queue.length, 0);
			strictEqual(change, "has changed");
		});

		test("Constructor accepts two arguments and starts", 5, function ()
		{
			var change = "has not changed";

			function fncChange()
			{
				change = "has changed";
			}

			var queue = [];

			queue.push(fncChange);

			strictEqual(queue.length, 1);

			var result = new JoelPurra.CollectCalls(queue, true);

			strictEqual(result.queue.length, 0);
			strictEqual(change, "has changed");

			result.join();

			strictEqual(result.queue.length, 0);
			strictEqual(change, "has changed");
		});

	} ());

	(function ()
	{
		module("Queue");

		test("Can run one function twice", 6, function ()
		{
			var counter = 0;

			function fncIncrement()
			{
				counter += 1;
			}

			var queue = [];

			queue.push(fncIncrement);
			queue.push(fncIncrement);

			strictEqual(queue.length, 2);
			strictEqual(counter, 0);

			var result = new JoelPurra.CollectCalls(queue);

			strictEqual(result.queue.length, 2);
			strictEqual(counter, 0);

			result.join();

			strictEqual(result.queue.length, 0);
			strictEqual(counter, 2);
		});

		test("Can run one function twice, before and after constructor", 8, function ()
		{
			var counter = 0;

			function fncIncrement()
			{
				counter += 1;
			}

			var queue = [];

			queue.push(fncIncrement);

			strictEqual(queue.length, 1);
			strictEqual(counter, 0);

			var result = new JoelPurra.CollectCalls(queue);

			strictEqual(result.queue.length, 1);
			strictEqual(counter, 0);

			result.push(fncIncrement);

			strictEqual(result.queue.length, 2);
			strictEqual(counter, 0);

			result.join();

			strictEqual(result.queue.length, 0);
			strictEqual(counter, 2);
		});

		test("Can run one function thrice, before and after constructor and after join", 10, function ()
		{
			var counter = 0;

			function fncIncrement()
			{
				counter += 1;
			}

			var queue = [];

			queue.push(fncIncrement);

			strictEqual(queue.length, 1);
			strictEqual(counter, 0);

			var result = new JoelPurra.CollectCalls(queue);

			strictEqual(result.queue.length, 1);
			strictEqual(counter, 0);

			result.push(fncIncrement);

			strictEqual(result.queue.length, 2);
			strictEqual(counter, 0);

			result.join();

			strictEqual(result.queue.length, 0);
			strictEqual(counter, 2);

			result.push(fncIncrement);

			strictEqual(result.queue.length, 0);
			strictEqual(counter, 3);
		});

		test("Constructor copies original queue", 20, function ()
		{
			var counter = 0;

			function fncIncrement()
			{
				counter += 1;
			}

			var queue = [];

			queue.push(fncIncrement);

			strictEqual(queue.length, 1);
			strictEqual(counter, 0);

			var result = new JoelPurra.CollectCalls(queue);

			strictEqual(queue.length, 1);
			strictEqual(result.queue.length, 1);
			strictEqual(counter, 0);

			queue.push(fncIncrement);

			strictEqual(queue.length, 2);
			strictEqual(result.queue.length, 1);
			strictEqual(counter, 0);

			result.push(fncIncrement);
			
			strictEqual(queue.length, 2);
			strictEqual(result.queue.length, 2);
			strictEqual(counter, 0);

			result.join();
			
			strictEqual(queue.length, 2);
			strictEqual(result.queue.length, 0);
			strictEqual(counter, 2);

			queue.push(fncIncrement);
			
			strictEqual(queue.length, 3);
			strictEqual(result.queue.length, 0);
			strictEqual(counter, 2);

			result.push(fncIncrement);
			
			strictEqual(queue.length, 3);
			strictEqual(result.queue.length, 0);
			strictEqual(counter, 3);
		});

	} ());

	(function ()
	{
		module("Error handling");

		test("Can ignore function errors", 10, function ()
		{
			var counter = 0;

			function fncIncrement()
			{
				counter += 1;
			}

			function fncError()
			{
				throw new Error("fncError");
			}

			var queue = [];

			queue.push(fncIncrement);
			queue.push(fncError);
			queue.push(fncIncrement);

			strictEqual(queue.length, 3);
			strictEqual(counter, 0);

			var result = new JoelPurra.CollectCalls(queue);

			strictEqual(result.queue.length, 3);
			strictEqual(counter, 0);

			result.push(fncIncrement);
			result.push(fncError);
			result.push(fncIncrement);

			strictEqual(result.queue.length, 6);
			strictEqual(counter, 0);

			result.join();

			strictEqual(result.queue.length, 0);
			strictEqual(counter, 4);

			result.push(fncIncrement);
			result.push(fncError);
			result.push(fncIncrement);

			strictEqual(result.queue.length, 0);
			strictEqual(counter, 6);
		});

		test("Can add non-functions", 10, function ()
		{
			var counter = 0;

			function fncIncrement()
			{
				counter += 1;
			}

			var notAFunction = 123456;

			var queue = [];

			queue.push(fncIncrement);
			queue.push(notAFunction);
			queue.push(fncIncrement);

			strictEqual(queue.length, 3);
			strictEqual(counter, 0);

			var result = new JoelPurra.CollectCalls(queue);

			strictEqual(result.queue.length, 3);
			strictEqual(counter, 0);

			result.push(fncIncrement);
			result.push(notAFunction);
			result.push(fncIncrement);

			strictEqual(result.queue.length, 6);
			strictEqual(counter, 0);

			result.join();

			strictEqual(result.queue.length, 0);
			strictEqual(counter, 4);

			result.push(fncIncrement);
			result.push(notAFunction);
			result.push(fncIncrement);

			strictEqual(result.queue.length, 0);
			strictEqual(counter, 6);
		});
	} ());
} ());

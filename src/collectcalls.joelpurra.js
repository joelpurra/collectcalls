/*!
 * @license CollectCalls
 * Copyright (c) 2010, 2011, 2012, Joel Purra <http://joelpurra.se/>
 * Released under BSD, MIT and GPL, see LICENSES.
 *
 * Collects functions that should be called in the future.
 */

/*jslint vars: true, white: true*/

// Set up namespace, if needed
var JoelPurra = JoelPurra || {};

(function (global, namespace)
{
	"use strict";

	function bindCall(context, fnc)
	{
		return function ()
		{
			var args = Array.prototype.slice.call(arguments);

			fnc.call(context, args);
		};
	}

	function noop()
	{
	}

	function getErrorLogger()
	{
		var logger = noop;
		var context = null;

		if (global.console)
		{
			if (global.console.error
				|| global.console.log)
			{
				logger = global.console.error || global.console.log;
				context = global.console;
			}
		}

		return bindCall(context, logger);
	}

	function logError()
	{
		return getErrorLogger();
	}

	// Public CollectCalls functions
	namespace.CollectCalls = function (queue, ready)
	{
		this.queue = queue;
		this.ready = (ready === true);
		this.handleQueue();

		return this;
	};

	namespace.CollectCalls.prototype.join = function ()
	{
		this.ready = true;
		this.handleQueue();
	};

	namespace.CollectCalls.prototype.push = function (fnc)
	{
		this.queue.push(fnc);
		this.handleQueue();
	};

	// Private CollectCalls methods
	namespace.CollectCalls.prototype.handleOne = function (fnc)
	{
		try
		{
			fnc.call(null);
		}
		catch (handleOneError)
		{
			logError()(handleOneError);
		}
	};

	namespace.CollectCalls.prototype.handleQueue = function ()
	{
		if (this.ready)
		{
			while (this.queue.length)
			{
				var fnc = this.queue.shift();

				this.handleOne(fnc);
			}
		}
	};

} (this, JoelPurra));

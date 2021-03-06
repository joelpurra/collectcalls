/*!
 * @license CollectCalls
 * Copyright (c) 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, Joel Purra <https://joelpurra.com/>
 * Released under BSD, MIT and GPL, see LICENSES.
 *
 * Collects functions that should be called in the future.
 */

/*jslint vars: true, white: true*/

// Set up namespace, if needed
var JoelPurra = JoelPurra || {};

(function(namespace)
{
    "use strict";

    // Public CollectCalls functions
    namespace.CollectCalls = function(queue, ready)
    {
        this.queue = (queue !== undefined ? queue.concat() : []);
        this.ready = (ready === true);
        this.handleQueue();

        return this;
    };

    namespace.CollectCalls.prototype.join = function()
    {
        this.ready = true;
        this.handleQueue();
    };

    namespace.CollectCalls.prototype.push = function(fnc)
    {
        this.queue.push(fnc);
        this.handleQueue();
    };

    // Private CollectCalls methods
    namespace.CollectCalls.prototype.handleOne = function(fnc)
    {
        try
        {
            fnc(null);
        }
        catch (handleOneError)
        {
            // TODO: don't hide errors
        }
    };

    namespace.CollectCalls.prototype.handleQueue = function()
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
}(JoelPurra));

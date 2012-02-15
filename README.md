# CollectCalls javascript library.
Collects `function () { }` blocks that should be called in the future. The script `collectcalls.joelpurra.js` does not need to load until the future is nigh.

While executing an inline script, it might have pending dependencies that prevents it from completing right away. CollectCalls can collect functions and call them at a later time, when the time is right.

## Use CollectCalls when...
* When dynamically generated server-side inline `<script>` tags are
 * Dependent on other scripts/plugins that load later.
 * Blocking the load or execution of the rest of the page.
* When static scripts/plugins are
 * [Loaded at the bottom of the page](http://developer.yahoo.com/performance/rules.html#js_bottom), near `</body>`.
 * [Split into pieces and loaded asynchronously](http://code.google.com/speed/page-speed/docs/payload.html#DeferLoadingJS) after everything else.
 * [Loaded in parallel](http://labjs.com/).
 * [Executed asynchronously](http://www.whatwg.org/specs/web-apps/current-work/#attr-script-async).
 * [Defered until page has loaded](http://www.w3.org/TR/REC-html40/interact/scripts.html#adef-defer).
* When generating data-heavy pages, and
 * Custom `data-*` attributes aren't enough.
 * Elements need to bind to custom (dynamic) functions (without using `data-*` with `eval()`).
* When writing a script/plugin that needs to execute with dynamic values as soon as it has loaded.

The dynamic script tags might be generated by templates, page parts, included files or scoped functions. They might contain logic based on data from the model/database that will be used by other scripts, when they have loaded.

## Demos
* [`example/demo.html`](http://joelpurra.github.com/collectcalls/example/demo.html): Simple demo with blocking scripts versus CollectCalls.

## Basic example with jQuery
jQuery is loaded at the bottom of the page for efficiency, but `<script>` tags are generated by page parts. Use `CollectCalls(...)` to let the `<script>` tags enqueue functionality until jQuery has loaded, then execute it with `.join()`.

```html
<!-- Code that is written to the HTML now, but needs to be executed later -->
<!-- This can be anywhere on the page, even after CollectCalls(...), and multiple times -->
<script>
	// Set up, or reuse, a queue built as an array object
	var runWithJQuery = runWithJQuery || [];

	runWithJQuery.push(function() {
		// Do some heavy lifting with jQuery
		var scriptCount = $("script").length;

		// Then show alert box - it won't block the page load, since it's already done
		var msg = "jQuery has loaded, the page is ready and the queue is invoked." + "\n\n"
			+ "Found " + scriptCount + " script tags on the page, using jQuery " + $.fn.jquery + ".";
		alert(msg);
	});
</script>

<!-- Load jQuery (and plugins) at the end of the page for efficiency -->
<script src="http://code.jquery.com/jquery-latest.js"></script>

<!-- Load collectcalls.joelpurra.js at any point before calling JoelPurra.CollectCalls(...) -->
<script src="https://raw.github.com/joelpurra/collectcalls/master/src/collectcalls.joelpurra.js"></script>
 
<script>
	// This code won't be executed until jQuery has been loaded.
	$(function ()
	{
		// Wrap the queue with CollectCalls
		runWithJQuery = new JoelPurra.CollectCalls(runWithJQuery);
		
		// Invoke the entire queue in the order the functions were added
		runWithJQuery.join();
	});
</script>
```

## Usage
CollectCalls was inspired by the command queue in [Google Analytic's Asynchronous Syntax](http://code.google.com/apis/analytics/docs/tracking/asyncUsageGuide.html).

```javascript
// Set up, or reuse, a queue built as an array object.
// This can be done as many times you like, even after CollectCalls(...).
var collectCallQueue = collectCallQueue || [];

// Push any function.
// This can be done as many times you like, even after CollectCalls(...).
collectCallQueue.push(fnc);

// When the time is right, wrap the queue with CollectCalls(...).
// This can only be done once per queue.
collectCallQueue = new JoelPurra.CollectCalls(collectCallQueue);

// Then invoke the entire queue in the order the functions were added.
// This is only necessary to do once per queue.
collectCallQueue.join();

// Pass true as the second argument, and the queue will be
// invoked right away without calling .join()
// This can only be done once per queue.
collectCallQueue = new JoelPurra.CollectCalls(collectCallQueue, true);
```

## Dependencies
CollectCalls does not have any dependencies.

## Browser compatibility
Should be compatible with all javascript-enabled browsers. You are encouraged to [run the CollectCalls test suite](http://joelpurra.github.com/collectcalls/test/) and then report any issues.

## License
Copyright (c) 2010, 2011, 2012, Joel Purra <http://joelpurra.se/>
All rights reserved.

When using CollectCalls, comply to at least one of the three available licenses: BSD, MIT, GPL.
Please see the LICENSE file for details.

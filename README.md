# UX.js

<img src="https://github.com/flaneurette/UX.js/blob/main/assets/images/UX-logo.png" />

A minimal JavaScript framework, UX automates the most used frontend development tasks. Similar to VUE.js, React and other frameworks, but much easier to work with. UX.js is unique as it separates data loading and DOM manipulation from other JavaScript logic, making it much quicker to learn and easier to implement or add to existing JavaScript code. UX.js lets you create a website or app in hours.

# What is new
Version 1.4 introduces components. Components are reusable static HTML blocks that have a .ux extension. UX.js renders these components within a HTML page, asynchronously, with the :render attribute or render() function. Components have placeholders that can be parsed by UX.js. For a demo, see UX-render.html in the examples folder. In this way, a website can be completely build from reusable components, making it easy to reuse components across a website or other websites.

<img src="https://github.com/flaneurette/UX.js/blob/main/assets/images/render_flowchart.png" />

# Examples

#### hello-world.html
A simple example of how UX.js works.
#### UX-render.html
An example of rendering reusable UX components from the /components/ directory. 
#### UX-animate.html
An example showing the animate attribute, to dynamically animate objects.
#### UX-cascade.html
An example showing the cascade attribute, to dynamically layer objects.
#### UX-fetch.html
An example fetching unique JSON and displaying it.
#### UX-lazyload.html
An example lazyloading images
#### UX-bind.html
An example how to bind to classes.
#### UX-if.html
An example to see how the IF statements in UX.js works
#### UX-loop.html
An example of how the loop function in UX.js works
#### UX-curtain.html
An example to show and hide objects in HTML
#### UX-menu.html
An example showing the menu attribute, dynamically generated with UX.js
#### UX-toggle.html
An example showing the toggle attribute, to switch a menu on/off
#### UX-zebra.html
An example showing the zebra attribute, dynamically generated with UX.js
#### UX-active.html
An example showing the active URL attribute, to switch css classes dynamically
#### UX-select.html
An example showing the select attribute, to switch css classes dynamically
#### UX-flex.html
An example showing the flexbox attribute, dynamically generated with UX.js (no CSS)
#### UX-scroll.html
An example showing the scroll attribute
#### UX-void.html
An example showing the void attribute
#### UX-link.html
An example showing the link attribute
#### UX-async.html
An example of how form async in UX.js works
#### UX-http.html
An example showing a http request
#### UX-events.html
An example to trigger events
#### UX-methods.html
An example of how methods in UX.js works (under development)
#### UX-cleartype.html
An example of how Clear Type in UX.js works (under development)
#### UX-forms.html
An example showing a form, dynamically generated with UX.js

# Full examples
#### responsive-flex.html
An example showing a responsive template, dynamically generated with UX.js (including toggle & flex)
#### dev-tool.html
By setting devtools: true, UX.js shows tooltip information and borders the elements for development.
#### website.html
An example showing a responsive website, dynamically generated with UX.js
#### interface.html
An example showing a responsive interface, dynamically generated with UX.js
#### blog.html
An example showing a blogpage, dynamically generated with UX.js
#### shopping-cart.html
An example showing a shoppingcart, dynamically generated with UX.js

# Code Explanation

### 1. Static Properties:
- docElements: Stores a reference to all the HTML elements on the page.
- contentType: Defines the default content type for HTTP requests.
- asyncType: Defines the default content type for asynchronous HTTP requests.
- allowOrigin: Defines the default allowed origin for cross-origin requests.

### 2. Initialization:
- init: An object that holds the library's name, version, copyright, license, and a unique instance ID.

### 3. Load Function:
- load(list): This function is responsible for initializing and binding various UI behaviors to the HTML elements on the page. It processes the provided list object, which contains data, methods, and events, and applies the corresponding behaviors.

### 4. Node Manipulation Functions:
- nodes(method, find, value, data, methods, callback): This function is a central hub for applying various UI behaviors to the HTML elements. It dispatches the appropriate behavior based on the provided method parameter. 
- getElements(), nodeParentList(), and nodeChildren(parents): These functions help retrieve and manage the HTML elements on the page. 
- getAtt(node, part) and getAttCheck(node, part): These functions retrieve and check the presence of custom attributes on HTML elements.

### 5. DOM Manipulation Functions:
- dom(id, method, value): Provides a set of methods for interacting with HTML elements by their ID, such as getting/setting values, toggling visibility, and manipulating HTML content. 
- cloneNodes(list, id): Clones a node and appends it to the parent element.

### 6. Behavior Binding Functions:
- bindClass(node, find, value), bindId(node, find, value), bindShow(node), bindHide(node), bindVoid(node), bindScroll(node), bindActive(node), bindSelect(node), bindFlex(node), bindAnimate(node), bindCascade(node, find), bindLazyLoad(node, find), bindUri(node), bindToggle(node), bindMenu(node), bindFunctions(node, find, value), bindMethods(node, data, methods, find, value), bindOn(node, data, methods, find, value), bindIf(node, find, value), loop(node, find, values), bindPrevent(node, find, value): These functions bind various UI behaviors to the HTML elements, such as toggling visibility, applying CSS classes, handling clicks, and processing data.

### 7. Rendering and Data Handling Functions:
- reparse(nodes, data): Replaces placeholders in the HTML with the corresponding data values.
- render(node, data): Fetches and renders a component template, replacing the placeholders with the provided data. fetch(obj): Replaces placeholders in the HTML with the corresponding data values from the provided object.

### 8. Asynchronous Functions:
- async(uri, method, callback): Handles asynchronous form submissions and makes AJAX requests to the specified URI.
- http(uri, method, callback): Handles synchronous HTTP requests to the specified URI.

### 9. Form Handling Functions:
- createElements(node, type, arr): Creates HTML elements based on the provided configuration object.
- createForm(node, find, values): Generates a form based on the provided configuration object.

### 10. Utility Functions:
- drawCurtains(): Reveals hidden elements with the :curtain attribute. 
- has(value): Extracts a value from a string enclosed in single quotes. 
- clearType(node, find, value): Replaces custom HTML tags. 
- bindDevtool(node): Adds a title and border to the element for debugging purposes. 
- log(msg): Logs a message to the console.
- msg: An object containing error messages. 

Overall, this library provides a comprehensive set of tools and functions for building dynamic user interfaces, handling user interactions, managing data, and making HTTP requests.


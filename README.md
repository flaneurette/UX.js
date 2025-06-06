# UX.js

<img src="https://github.com/flaneurette/UX.js/blob/main/examples/images/UX-logo.png" />

UX.js is a powerful and lightweight JavaScript framework designed for building both single-page applications (SPAs) and multi-page applications (MPAs) with ease. It provides a structured and efficient approach to frontend development, enabling developers to create dynamic, interactive, and highly responsive web applications for better user experiences.

Key Features of UX.js

- Automates the most common front-end development tasks
- UX Components – The framework introduces a component-based architecture
- UX Plugin Support – Extend the core functionality of UX.js with plugins
- Reactive Modules – The framework has a reactive model

With its focus on simplicity, flexibility, and performance, UX.js is an excellent choice for developers looking to build modern web applications with a clean and maintainable codebase.

# Installation

Use jsdelivr for CDN hosting:
https://cdn.jsdelivr.net/gh/flaneurette/UX.js@master/src/UX.js

Or download and clone the full package.

# What is new
### UX.js Version 1.8: Exciting New Features & Enhancements
The release of UX.js v1.8 brings significant improvements, making the framework more powerful and flexible than ever. This version introduces:

- Reactive Models – A new reactivity system that ensures data updates are seamlessly reflected across the application without manual intervention. This enhancement simplifies state management and improves performance by efficiently handling UI updates.
- Plugin Support – Developers can now extend UX.js with plugins, enabling easy integration of additional features, third-party tools, and custom functionalities. This opens the door for a more modular and scalable development experience.

### UX.js Version 1.4: introduces Components. 

Components are reusable HTML fragments with a .ux extension. UX.js components separates HTML from scripts, and renders these components within a HTML page asynchronously with the :render or :route attribute. For a demo, see UX-render.html in the examples folder.

<img src="https://github.com/flaneurette/UX.js/blob/main/examples/images/render_flowchart.png" />

### UX Components (.ux Files)
A UX component is a self-contained UI element written in .ux format. It is possible to call all UX.js one-way attribute bindings to achieve certain features.

Example of a .ux Component:

```
<section>
    <header>
        <h1>{{title}}</h1>
    </header>
    <nav>
        <ul :loop="links">
            <li>{{link}}</li>
        </ul>
    </nav>
</section>
```

# Requirements
A local or live webserver.

# Examples

#### hello-world.html
A simple example of how UX.js works.
#### UX-Reactive.html
A reactive module loader example, using the :reactive attribute to route and execute modules.
#### UX-Webcomponents.html
A webcomponents example, using the :shadow attribute.
#### UX-render.html
An example of rendering reusable UX components from the /components/ directory.
#### UX-route.html
An example of asynchronous component routing, using the :route attribute.
#### UX-switch.html
An example of event binding to trigger CSS transformations, using the :switch attribute.
#### UX-wheel.html
An example to trigger a slide, using the :wheel attribute.
#### UX-swipe.html
An example on how to move objects, using the :swipe attribute.
#### UX-touch.html
An example handling touch events using the :touch attribute
#### UX-shimmer.html
An example loading JSON and showing the shimmer effect
#### UX-spinner.html
An example with a spinner loader using the :spinner attribute
#### UX-flip.html
An example flipping objects using the :flip attribute
#### UX-drag.html
An drag and drop example plugin from /plugins/
#### UX-darkmode.html
An example to trigger a different mode, light or dark.
#### UX-observe.html
An example showing the :observe attribute, to observe intersections
#### UX-hamburger.html
An example showing the :hamburger attribute, same as ux-toggle.
#### UX-toggle.html
An example showing the :toggle attribute, to switch a menu on/off.
#### UX-input.html
An example showing the :input attribute
#### UX-cart.html
An example creating a shopping cart with UX.js.
#### UX-fade.html
An example showing the :fade attribute to fade items into view.
#### UX-view.html
An example showing the :view attribute to scroll items into view.
#### UX-progress.html
An example with a progressmeter, to pseudo measure page loading with the :progress attribute
#### UX-gallery.html
An example creating a gallery through methods.
#### UX-grow.html
An example showing the :grow attribute, to grow elements dynamically on scroll into view.
#### UX-animate.html
An example showing the :animate attribute, to dynamically animate objects.
#### UX-fetch.html
An example fetching unique JSON and displaying it.
#### UX-lazyload.html
An example lazyloading objects with :lazyload attribute
#### UX-lazyimg.html
An example lazyloading images with :lazyimg attribute
#### UX-handler.html
An example creating evenlisteners through the :handler attribute.
#### UX-bind.html
An example how to bind to classes.
#### UX-on.html
Listens for an event and executes a global function.
#### UX-run.html
Listens for an event and executes a subscribed function (useful with :reactive)
#### UX-if.html
An example to see how the IF statements in UX.js works
#### UX-loop.html
An example of how the loop function in UX.js works
#### UX-curtain.html
An example to show and hide objects in HTML
#### UX-zebra.html
An example showing the :zebra attribute, dynamically generated with UX.js
#### UX-active.html
An example showing the :active URL attribute, to switch css classes dynamically
#### UX-select.html
An example showing the :select attribute, to switch css classes dynamically
#### UX-flex.html
An example showing the :flex attribute, dynamically generated with UX.js (no CSS)
#### UX-scroll.html
An example showing the :scroll attribute
#### UX-void.html
An example showing the :void attribute
#### UX-link.html
An example showing the :link attribute
#### UX-async.html
An example of how form async in UX.js works
#### UX-http.html
An example showing a http request
#### UX-events.html
An example to trigger events
#### UX-methods.html
An example of how methods in UX.js works (under development)
#### UX-forms.html
An example showing a form, dynamically generated with UX.js

# State Management & Reactivity

UX.js provides a reactive state system similar to Vue.js and React.js.

# Plugins & Extensions

UX.js allows extending functionality using plugins.

import { About } from "./about.js";
import { Content } from "./content.js";
import { Form } from "./form.js";
import { Counter } from "./counter.js";

// Default state of counter (app.state can be object as well).
app.state.counter = 0;

// Default states of the form
app.state.agreed = 'No';
app.state.foods = [];

// Bind modules to UX.js
app.modules = [Content, About, Form, Counter];

// Bind functions to UX.js (except for init() and render(), as they are called by UX.js) 
app.functions = [Counter.increment];

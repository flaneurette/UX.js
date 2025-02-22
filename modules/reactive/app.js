import { About } from "./about.js";
import { Content } from "./content.js";
import { Counter } from "./counter.js";

// Default state of counter (app.state can be object as well).
app.state = 0;

// Bind modules to UX.js
app.modules = [Content, About, Counter];

// Bind functions to UX.js (except for init() and render(), as they are called by UX.js) 
app.functions = [Counter.increment];

import { About } from "./about.js";
import { Content } from "./content.js";
import { Counter } from "./counter.js";

// Bind modules to UX.js
app.modules = [Content, About, Counter];

// Bind functions to UX.js (except for init, as init is already called by UX.js) 
app.functions = [Counter.increment];

// Default state of counter
app.state = 0;
import { About } from "./about.js";
import { Content } from "./content.js";
import { Counter } from "./counter.js";

// Bind modules to UX.JS
app.modules = [Content, About, Counter];

// Bind functions to UX.JS (except for init)
app.functions = [Counter.increment];


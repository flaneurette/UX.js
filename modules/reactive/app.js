import { About } from "./about.js";
import { Content } from "./content.js";
import { Shimmer } from "./shimmer.js";
import { Form } from "./form.js";
import { Counter } from "./counter.js";
import { Hello } from "./hello.js";

// Bind modules to UX.js
app.modules = [Content, Shimmer, About, Form, Counter, Hello];

// Bind functions to UX.js 
app.functions = [Counter.increment];

// Default state of counter
app.state.counter = 0;

// Default states of the form
app.state.selected = [];
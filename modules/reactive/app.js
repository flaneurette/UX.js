import { About } from "./about.js";
import { Content } from "./content.js";
import { Shimmer } from "./shimmer.js";
import { Form } from "./form.js";
import { Counter } from "./counter.js";
import { Hello } from "./hello.js";

// Bind modules to UX.js
app.modules = [Content, Shimmer, About, Form, Counter, Hello];

// Subscribe functions to UX.js 
app.functions = [Counter.increment,Counter.decrement];

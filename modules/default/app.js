import { Script } from "./script.js";

// Default state (app.state can be object as well).
app.state = 0;

// Bind modules to UX.js
app.modules = [Script];

// Bind functions to UX.js (except for init() and render(), as they are called by UX.js) 
app.functions = [function];

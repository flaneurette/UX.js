import { About } from "./about.js";
import { Content } from "./content.js";
import { Shimmer } from "./shimmer.js";
import { Form } from "./form.js";
import { Counter } from "./counter.js";

// Bind modules to UX.js
app.modules = [Content, Shimmer, About, Form, Counter];

// Bind functions to UX.js 
app.functions = [Counter.increment];

// Default state of counter
app.state.counter = 0;

// Default states of the form
app.state.agreed = 'No';
app.state.selected = [];

// Bind content
app.load({
	data: {
		stock: 'We have these foods in stock;',
		foods: [
		{name: 'Bananas'},
		{name: 'Candy'},
		{name: 'Oranges'},
		{name: 'Vegetables'}]
	}
});

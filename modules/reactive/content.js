export const Content = {
	
	id: 'Content',

	init() {
		
		app.initState({
			data: {
				stock: 'We have these foods in stock;',
				foods: [
				{name: 'Bananas'},
				{name: 'Candy'},
				{name: 'Oranges'},
				{name: 'Vegetables'}]
			}
		});
	},
	
	// UX.js one-way attribute bindings can be attached, such as :loop
	render: () => `
		<h3>Content</h3>
		<p>{{stock}}</p>
		<ul :loop="foods" class="buttons">
			<li><input type="button" onclick="handleClick(event.target.value);" value="{{name}}" /></li>
		</ul>
	`,
};

const fun = () => {
	window.handleClick = (text) => {
		alert(text);
	}
};

// Subscribe
app.setFun(fun);
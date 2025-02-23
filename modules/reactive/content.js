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
	
	// UX.js attribute functions can be called, such as :loop
	render: () => `
		<h3>Content</h3>
		<p>{{stock}}</p>
		<ul :loop="foods">
			<li><input type="button" onclick="handleClick(event.target.value);" value="{{name}}" /></li>
		</ul>
	`,
};


window.handleClick = (text) => {
	alert(text);
}

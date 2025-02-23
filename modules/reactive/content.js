export const Content = {
	
	id: 'Content',

	init() {
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
	},
	
	// All UX.js attribute functions can be called, such as :loop
	render: () => `
		<h3>Content</h3>
		<p>{{stock}}</p>
		<ul :loop="foods">
			<li onclick="handleClick(event.target.innerText);">{{name}}</li>
		</ul>
	`,
};


window.handleClick = (text) => {
	alert(text);
}

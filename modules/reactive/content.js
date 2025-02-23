export const Content = {
	
	id: 'Content',

	init: () => null,
	
	// All UX.js attribute functions can be called, such as :loop
	
	render: () => `
		<h3>Content</h3>
		<p>{{stock}}</p>
		<ul :loop="foods">
			<li>{{name}}</li>
		</ul>
	`,
};

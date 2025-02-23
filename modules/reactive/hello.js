export const Hello = {
	
	id: 'Hello',

	template() {
		return `
		<h3>${app.state.title || 'Hello World!'}</h3>
			<button onclick="changeTitle()">Update title</button>
		`;
	},
};

window.changeTitle = () => {
	// setState(object,appId) requires a template() to render.
    app.setState({ title: 'Hello!' },'app');
}
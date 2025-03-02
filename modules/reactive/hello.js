export const Hello = {
	
	id: 'Hello',

	init() {
		// Get states.
		app.state.title = app.getState('title') ?? 'Hello World!';
	},
	
	template() {
		return `
		<h3>${app.state.title}</h3>
		<button onclick="changeTitle()">Update title</button>
		`;
	},
};

const fun = () => {
	window.changeTitle = () => {
		app.setState({ title: 'Hello this is reactive UX.js!' }, Hello.id, true);
	}
}

// Subscribe
app.setFun(fun);
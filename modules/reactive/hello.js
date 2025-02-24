export const Hello = {
	
	id: 'Hello',

	template() {
		return `
		<h3>${app.state.title || 'Hello World!'}</h3>
		<button onclick="changeTitle()">Update title</button>
		`;
	},
};

const fun = () => {
	window.changeTitle = () => {
		app.setState({ title: 'Hello this is reactive UX.js!' },'app');
	}
}

app.setFun(fun);
export const Counter = {

	id: 'Counter',
	
	init() {
		app.state.counter = app.getState('counter') ?? 0;
	},

	render() {
		return `
			<h3>Count: <span id="counter">${app.state.counter || 0}</span></h3>
			<button data-action="increment" class="button" id="musthaveanid1">Increment</button>
			<button data-action="decrement" class="button" id="musthaveanid2">Decrement</button>
		`;
	},

	increment() {
		app.setState({counter: app.state.counter += 1}, Counter.id, true);
	},
	
	decrement() {
		app.setState({counter: app.state.counter -= 1}, Counter.id, true);
	}
}

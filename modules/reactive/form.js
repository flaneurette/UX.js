export const Form = {

	id: 'Form',
	
	init() {
		// Get states.
		app.state.selected = app.getState('selected') ?? [];
		app.state.agreed = app.getState('agreed');
	},

	render() {
		return `
		<h3>Form bindings</h3>
		<form :async="true">
			<fieldset>
				<legend>Do you agree to our terms?</legend>
				<input type="radio" name="agreed" id="yes" value="Yes" 
				${app.state.agreed === 'Yes' ? 'checked' : ''} 
				onChange="reactiveRadio(event.target.value);" />
				<label for="yes">Yes</label>
				<br />
				<input type="radio" name="agreed" id="no" value="No" 
				${app.state.agreed === 'No' ? 'checked' : ''} 
				onChange="reactiveRadio(event.target.value);" />
				<label for="no">No</label>
			</fieldset>
		</form>
		<p>
			<strong>Agreed to:</strong>
			<span id="agreed">${app.state.agreed}</span>
		</p>
		<form :async="true">
		<fieldset>
			<legend>Select items:</legend>
				<input type="checkbox" name="foods[]" id="apples" value="Apples" 
				${app.state.selected.includes('Apples') ? 'checked' : ''} 
				onChange="reactiveChecked(event.target.value,event.target.checked);" />
				<label for="apples">Apples</label>
				<input type="checkbox" name="foods[]" id="oranges" value="Oranges" 
				${app.state.selected.includes('Oranges') ? 'checked' : ''} 
				onChange="reactiveChecked(event.target.value,event.target.checked);" />
				<label for="oranges">Oranges</label>
		</fieldset>
		</form>
		<p>
			<strong>Selected:</strong>
			<span id="foods">${app.state.selected}</span>
		</p>
		`;
	},
}

const fun1 = () => {
	
	window.reactiveRadio = (value) => {
		let counterElement = document.querySelector('#agreed');
		counterElement.textContent = value;
		// Update state
		app.setState({ agreed: value }, Form.id, true);
	}
};

const fun2 = () => {
	
    window.reactiveChecked = (value, checked) => {
        app.state.selected = checked  ? [...new Set([...app.state.selected, value])]: app.state.selected.filter(item => item !== value);
        document.querySelector('#foods').textContent = app.state.selected.join(', ');
		// Update state
        app.setState({ selected: app.state.selected }, Form.id, true);
    };
};

// Subscribe
app.setFun(fun1);
app.setFun(fun2);
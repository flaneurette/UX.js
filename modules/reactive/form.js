export const Form = {

	id: 'Form',
	
	init() {
		// Get states.
		this.agreed = app.state.agreed;
		this.food = app.state.selected;
	},

	render() {
		return `
		<h3>Form bindings</h3>
		<form :async="true">
			<fieldset>
				<legend>Do you agree to our terms?</legend>
				<input type="radio" name="agreed" id="yes" value="Yes" 
				${this.agreed === 'Yes' ? 'checked' : ''} 
				onChange="reactiveRadio(event.target.value);" />
				<label for="yes">Yes</label>
				<br />
				<input type="radio" name="agreed" id="no" value="No" 
				${this.agreed === 'No' ? 'checked' : ''} 
				onChange="reactiveRadio(event.target.value);" />
				<label for="no">No</label>
			</fieldset>
		</form>
		<p>
			<strong>Agreed to:</strong>
			<span id="agreed">${this.agreed}</span>
		</p>
		<form :async="true">
		<fieldset>
			<legend>Select items:</legend>
				<input type="checkbox" name="foods[]" id="apples" value="Apples" 
				${this.food.includes('Apples') ? 'checked' : ''} 
				onChange="reactiveChecked(event.target.value,event.target.checked);" />
				<label for="apples">Apples</label>
				<input type="checkbox" name="foods[]" id="oranges" value="Oranges" 
				${this.food.includes('Oranges') ? 'checked' : ''} 
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
		app.state.agreed = value;
	}
};

const fun2 = () => {
	
	window.reactiveChecked = (value,checked) => {
		if (!app.state.selected .includes(value)) {
			app.state.selected .push(value);
		}
		let allFood = checked ? [...new Set(app.state.selected )] : app.state.selected .filter(item => item !== value);
		// Update state
		app.state.selected  = allFood;
		let counterElement = document.querySelector('#foods');
		counterElement.textContent = app.state.selected ;
	}
};

app.setFun(fun1);
app.setFun(fun2);

export const Shimmer = {
	
	id: 'Shimmer',

	init() {
		this.count = app.state.counter;
	},
	
	render: () => `
		<h3>UX Shimmer</h3>
		<div id="shimmering">
			<div class="shimmer skeleton"></div>
			<div class="shimmer skeleton"></div>
			<div class="shimmer skeleton"></div>
		</div>
	`,
	
	effect() {
		const shimmer = () => {
			const container = app.dom('shimmering','id');
			function render(data) {
			if(data) { 
				data = JSON.parse(data);
				container.innerHTML = "";
					data.forEach(blog => {
						const element = document.createElement("div");
						element.textContent = blog.blogname;
						container.appendChild(element);
					});
				}
			}
			function init() {
				setTimeout(() => {
				let data = app.http('server-side/blog-xhr/data.php', 'callback', render);
				}, 2000); // Pseudo loading a large file.
			}
			init();
		};
		shimmer();
	},
};


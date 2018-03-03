# Style Guidelines for Milestone's Frontend

## Design (CSS)
 * General CSS guidelines:
	* One CSS file (in src/css/*.CSS) per React component. Import a React component's CSS file in the component itself, not its parent or anything.
	* When possible, put a class on the element itself and style the class as opposed to using CSS classes and element selectors (e.g. if I have an `<img>`, give that img a class like `className='page-header__img'` and then style `.page-header__img {...}`, as opposed to styling `.page-header img {..}`). The 'class space element selector' method works, but can create conflicts down the line. The more granular your CSS, the better.
	* You'll notice that every CSS class starts with a `c-` or a `l-`. `c-` is for components (as in components of the page, not strictly react components). `l-` is for layouts (as in parent `<div>`s or `<Row>`s or `<Col>`s that are basically just a layout for their children). Don't stress it too much-- again, it's for readability. If it feels like a 'layout' to you, whatever that means, put an `l-` in front of it. If it feels like a component of the page/app, put a `c-` in front of it.
	* If you're going to use a Bootstrap class, put it first, between two square brackets, then put your custom classes after.
		* Example: `className='[ container ] custom-class'`
		* This is simply to keep the two separate when reading and debugging. Remember the spaces.
 * For CSS, we're going to be using a naming scheme known as BEM (block element modifier) with a few extra twists (the 'c-' and 'l-' thing mentioned above).
	* See: http://bdavidxyz.com/blog/how-to-name-css-classes/
	* Also see: https://www.smashingmagazine.com/2016/06/battling-bem-extended-edition-common-problems-and-how-to-avoid-them/
 * BEM looks real weird, and you might have some questions about BEM. Here's my quick responses:
	* Q: "Woah... those CSS class names are super ugly and long..."
		* A: You are absolutely right. They're also very noticable and readable, which is kinda the point. The page is what needs to be pretty, not our code :)
	* Q: "Okay... so what am I supposed to do about elements with grandchildren or great-grandchildren?"
		* A: That shit can get out of hand. Read the second link above. Essentially, BEM is for readability and debugging; you don't have to follow the `parent__child__grandchild...` structure super strictly, just as much as it helps to make sense of things (and would help SOMEONE ELSE make sense of things).
	* Q: "What if I just need to style one tiny random thing?"
		* Then don't worry about it, just give it a one word class name or whatever is easiest. BEM is for big complicated things that can get difficult to track as they grow bigger. If it's one tiny thing, do whatever is easiest.
 * Put comments in the CSS if need be. Again, WebPack will minify it out later.


## Code (JS)
 * Put things where they belong in the comment headers made at the top of each component for easy location.
 * camelCase variable and function names.
 * PascalCase class (component) names.
 * Put a space after the opening bracket and before the closing bracket of any JSX expression, before and after arrow syntax... just space things out. Readability is king.
	* Good: `{ (e) => fakeFunc(e) }`
	* Bad: `{(e)=>fakeFunc(e)}`
 * When possible, use single quotes (messy right now, needs to be cleaned up).
 * If an element has more than three props, line break and space the props out.
	* Good: 
	```
	<Element 
		className='someClass'
		id='someId'
		passedFunction={ (e) => this.parentFunction(e) }
		otherProp={ this.state.someData }
	/>
	```
	* Bad: `<Element className='someClass' id='someId' passedFunction={(e)=>this.parentFunction(e)} otherProp={this.state.someData} />`
 * When in doubt, space it out. WebPack will minify everything ever-- readability is king otherwise.

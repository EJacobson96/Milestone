/// Pre-baked Components
/////////////////////////////////////////
import React, { Component } from 'react';
import { DropdownButton, MenuItem } from 'react-bootstrap';

/// Standard Components
/////////////////////////////////////////
import NavBar from './components/NavBar';
import LoginForm from './components/LoginForm';

/// Images & Styles
/////////////////////////////////////////
import './css/App.css';
import logo from './img/logo.png';



class App extends Component {
	render() {
		return (
			<div className="App">
				<NavBar />

				<div className="main">
					<LoginForm />
				</div>

				<DropdownButton
				>
					<MenuItem eventKey="1">Action</MenuItem>
					<MenuItem eventKey="2">Another action</MenuItem>
					<MenuItem eventKey="3" active>
						Active Item
					</MenuItem>
					<MenuItem divider />
					<MenuItem eventKey="4">Separated link</MenuItem>
				</DropdownButton>
			</div>
		);
	}
}

export default App;

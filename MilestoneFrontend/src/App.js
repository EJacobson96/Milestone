/// Pre-baked Components & Packages
/////////////////////////////////////////
import React, { Component } from 'react';
import { DropdownButton, MenuItem } from 'react-bootstrap';

/// Standard Components
/////////////////////////////////////////
import NavBar from './components/NavBar';
import LoginForm from './components/LoginForm';
import SideBar from './components/SideBar';
import PageMask from './components/PageMask';

/// Images & Styles
/////////////////////////////////////////
import './css/App.css';
import logo from './img/logo.png';


class App extends Component {
	constructor(props) {
        super(props);
    
        this.toggleSideBar = this.toggleSideBar.bind(this);
    
        this.state = {
			userLoggedIn: false,
			sideBarOpen: false,
			navBarDisplay: false
        };
	}

	logIn(success) {
		if(success) {
			this.setState({
				userLoggedIn: true
			})
		}
		else {
			this.setState({
				userLoggedIn: false
			})
		}
	}
	
	render() {
		const displaySideBar = this.state.menuOpen;
		const displayNavBar = this.state.userLoggedIn;

		return (
			<div className="App">

				{displayNavBar &&
					<NavBar 
						openSideBar={(e) => this.toggleSideBar(e)}
					/>
				}

				{displaySideBar &&
					<SideBar 
						closeSideBar={(e) => this.toggleSideBar(e)}
					/>
				}

				<div className="main">
				{
					this.state.userLoggedIn ? (
						<h1>Under Construction!</h1>
					) : (
						<LoginForm
							logIn={(e) => this.logIn(e)}
						/>
					)
				}
				</div>

			</div>
		);
	}

	toggleSideBar(e) {
		let toggle = !this.state.menuOpen;
		this.setState({
			menuOpen: toggle
		})
		console.log(this.state);
	}
}

export default App;

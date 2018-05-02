/////////////////////////////////////////
/// Pre-baked Components & Packages
import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import MediaQuery from 'react-responsive';

/////////////////////////////////////////
/// Standard Components
import NavBar from './components/NavBar';
import DesktopNav from './components/desktop/DesktopNav';
import SideBar from './components/SideBar';
import LoginForm from './components/login/LoginForm';
import Main from './components/Main';

//Controllers
import UserController from './controllers/UserController'
import MessageController from './controllers/MessageController'

/////////////////////////////////////////
/// Images & Styles
import './css/App.css';

/////////////////////////////////////////
/// Code

class App extends Component {
	constructor(props) {
        super(props);
    
        this.state = {
			// userLoggedIn: false,
			userLoggedIn: true,
			sideBarOpen: false,
			navBarDisplay: false
		};
		this.getUserController = this.getUserController.bind(this);
		this.getMessagecontroller = this.getMessagecontroller.bind(this);
		this.toggleSideBar = this.toggleSideBar.bind(this);
	}

	getUserController() {
		return UserController;
	}

	getMessagecontroller() {
		return MessageController;
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
	
	toggleSideBar(e) {
		let toggle = !this.state.menuOpen;
		this.setState({
			menuOpen: toggle
		})
		console.log(this.state);
	}
	
	componentDidMount() {
		console.log(this.state);
	}
	
	render() {
		const displaySideBar = this.state.menuOpen;
		const isLoggedIn = this.state.userLoggedIn;
		return (
			<div className="App">
				<div>
				    <MediaQuery query="(min-device-width: 769px)">
					    {
							isLoggedIn &&
							<DesktopNav 
								userController={this.getUserController()}
							/>
						}
					</MediaQuery>
					<MediaQuery query="(max-device-width: 768px)">
						{
							isLoggedIn &&
							<NavBar 
								openSideBar={(e) => this.toggleSideBar(e)}
								userController={this.getUserController()}
							/>
						}

						{
							displaySideBar &&
							<SideBar 
								closeSideBar={(e) => this.toggleSideBar(e)}
							/>
						}
					</MediaQuery>
				</div>

				<div className="l-main">
					<Switch>
						<Route path ='/login' render={(props) => (
							<LoginForm
								logIn={(e) => this.logIn(e)}
								userLoggedIn = { this.state.userLoggedIn }
							/>
						)} />
						<Route path ='/' render={(props) => (
							<Main 
								messageController = { this.getMessagecontroller() }
								userController = { this.getUserController() }
								userLoggedIn = { this.state.userLoggedIn }
							/>
						)} />
					</Switch>
				</div>
			</div>
		);
	}
}

export default App;

/////////////////////////////////////////
/// Pre-baked Components & Packages
import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import MediaQuery from 'react-responsive';

/////////////////////////////////////////
/// Standard Components
import NavBar from './components/NavBar';
import DesktopNav from './components/desktop/DesktopNav';
import LoginForm from './components/login/LoginForm';
import Main from './components/Main';

//Controllers
import UserController from './controllers/UserController'
import MessageController from './controllers/MessageController'
import GoalController from './controllers/GoalController'

/////////////////////////////////////////
/// Images & Styles
import './css/App.css';

/////////////////////////////////////////
/// Code

class App extends Component {
	constructor(props) {
        super(props);
    
        this.state = {
			userLoggedIn: false,
			// userLoggedIn: true,
			sideBarOpen: false,
			navBarDisplay: false
		};
		this.getUserController = this.getUserController.bind(this);
		this.getMessagecontroller = this.getMessagecontroller.bind(this);
		this.getGoalController = this.getGoalController.bind(this);
	}

	getUserController() {
		return UserController;
	}

	getMessagecontroller() {
		return MessageController;
	}

	getGoalController() {
		return GoalController;
	}

	logIn() {
		if (localStorage.getItem('Authorization')) {
			this.setState({
				userLoggedIn: true,
			})
		} else {
			this.setState({
				userLoggedIn: false,
			})
		}
	}
	
	componentDidMount() {
		if (localStorage.getItem('Authorization')) {
			this.setState({
				userLoggedIn: true,
			})
		}
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
								userController={this.getUserController()}
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
								goalController = { this.getGoalController() }
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

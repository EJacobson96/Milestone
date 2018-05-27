/////////////////////////////////////////
/// Pre-baked Components & Packages
import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import MediaQuery from 'react-responsive';

/////////////////////////////////////////
/// Standard Components
import NavBar from './components/NavBar';
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
			sideBarOpen: false,
			navBarDisplay: false
		};
		this.getUserController = this.getUserController.bind(this);
		this.getMessagecontroller = this.getMessagecontroller.bind(this);
		this.getGoalController = this.getGoalController.bind(this);
		this.logIn = this.logIn.bind(this);
		this.logOut = this.logOut.bind(this);
	}

	//controller that handles fetching data related to users
	getUserController() {
		return UserController;
	}

	//controller that handles fetching data related to messaging
	getMessagecontroller() {
		return MessageController;
	}

	//controller that handles fetching data related to goals
	getGoalController() {
		return GoalController;
	}

	//checks to see if authorization token is in local storage 
	//and sets user to be logged in based off the token
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

	//clears authorization token from local storage and logs user out
	logOut() {
		this.getUserController().logOut()
		this.setState({
			userLoggedIn: false,
		})
	}
	
	//checks if authorization token exists and keeps user logged in if so
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
					{
						isLoggedIn &&
						<NavBar 
							logOut={(e) => this.logOut(e) }
							userController={this.getUserController()}
						/>
					}
				</div>

				<div className="l-main">
					<Switch>
						<Route path ='/login' render={(props) => (
							<LoginForm
								logIn={(e) => this.logIn(e)}
								userLoggedIn = { this.state.userLoggedIn }
								userController={ this.getUserController() }
							/>
						)} />
						<Route path ='/' render={(props) => (
							<Main 
								logOut={(e) => this.logOut(e) }
								currUser={ this.state.currUser }
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

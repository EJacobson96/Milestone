/////////////////////////////////////////
/// Pre-baked Components & Packages
import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';
import { Redirect } from 'react-router-dom';
import { Switch } from 'react-router-dom';

/////////////////////////////////////////
/// Standard Components
import NavBar from './components/NavBar';
import SideBar from './components/SideBar';
import LoginForm from './components/LoginForm';
import Main from './components/Main';

/////////////////////////////////////////
/// Images & Styles
import './css/App.css';

/////////////////////////////////////////
/// Code

// const PrivateRoute = ({ component: Component, isAuthenticated, ...rest}) => (
// 	<Route
// 		{...rest}
// 		render={props => (
// 			isAuthenticated
// 			? (
// 				<Component {...props} />
// 			)
// 			: (
// 				<Redirect to={{ pathname: '/login'}} />
// 			)
// 		)}
// 	/>
// );

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

				{isLoggedIn &&
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
					<Switch>
						<Route path ='/login' render={() => (
							<LoginForm
								logIn={(e) => this.logIn(e)}
								userLoggedIn = { this.state.userLoggedIn }
							/>
						)} />
						<Route path ='/' render={(props) => (
							<Main 
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

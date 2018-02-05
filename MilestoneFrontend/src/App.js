import React, { Component } from 'react';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import logo from './img/logo.png';

import LoginForm from './components/LoginForm';

import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">

        <Navbar>
          <Navbar.Header>
            <Navbar.Brand>
              <a href="#home"><img src= { logo } className="logo" /></a>
            </Navbar.Brand>
          </Navbar.Header>
          {/* <Navbar.Collapse>
            <Nav pullRight>
              <NavItem eventKey={1} href="#">
                Link Right
              </NavItem>
              <NavItem eventKey={2} href="#">
                Link Right
              </NavItem>
            </Nav>
          </Navbar.Collapse> */}
        </Navbar>

        <LoginForm />

      </div>
    );
  }
}

export default App;

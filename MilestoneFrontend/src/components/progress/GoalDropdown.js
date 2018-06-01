/////////////////////////////////////////
/// Package imports

import React, { Component, ReactDOM } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Dropdown, MenuItem, FormControl } from 'react-bootstrap';

/////////////////////////////////////////
/// Dev Notes
	/*
	 * 
	 */

/////////////////////////////////////////
/// Standard Components


/////////////////////////////////////////
/// Images & Styles
import '../../css/progress/GoalDropdown.css';
import threeDotImg from '../../img/task3dot.png';

/////////////////////////////////////////
/// Code

// A custom implementation of React Bootstrap's dropdown menu for manipulating a goal
// (marking the goal as approved, complete, or editing the goal).
class CustomToggle extends React.Component {
	constructor(props, context) {
		super(props, context);
	
		this.handleClick = this.handleClick.bind(this);
	}
  
	handleClick(e) {
		e.preventDefault();
	
		this.props.onClick(e);
	}
  
	render() {
	  	return (
			<a href="" onClick={this.handleClick}>
				{this.props.children}
			</a>
	  	);
	}
}

// Another part of the custom implementation.
class CustomMenu extends React.Component {
	constructor(props, context) {
	  	super(props, context);
  
	  	this.handleChange = this.handleChange.bind(this);
  
	  	this.state = {
			value: ''
	  	};
	}
  
	handleChange(e) {
	  	this.setState({ value: e.target.value });
	}
  
	focusNext() {
		const input = ReactDOM.findDOMNode(this.input);
	
		if (input) {
			input.focus();
		}
	}
  
	render() {
		const { children } = this.props;
		const { value } = this.state;
	
		return (
			<div className="dropdown-menu c-goal-dropdown__dropdown-menu" style={{ padding: '' }}>
				<ul className="list-unstyled">
					{React.Children.toArray(children).filter(
					child => !value.trim() || child.props.children.indexOf(value) !== -1
					)}
				</ul>
			</div>
		);
	}
}
  
// Displays the implementation.
class GoalDropdown extends React.Component {
	constructor(props, context) {
		super(props, context);

		this.state = {
		};
	}

	render() {
		let markGoalText = this.props.goal.completed === false ? ("Mark Goal Complete") : ("Mark Goal Incomplete");
		return (
			<Dropdown className='c-goal-dropdown' id='goal-dropdown'>
				<CustomToggle bsRole="toggle">
					<img src={ threeDotImg } className='c-goal-dropdown__img' />
				</CustomToggle>
			
				<CustomMenu bsRole="menu">
					<MenuItem eventKey="1" className='c-goal-dropdown__menu-li' onClick={ () => this.props.history.push('/progress/goals/editgoal/:id' + this.props.goal.id) }>
						Edit Goal
					</MenuItem>
					<hr className='c-goal-dropdown__divider' />
					<MenuItem eventKey="2" className='c-goal-dropdown__menu-li' onClick={ () => this.props.markGoalComplete() }>
						{ markGoalText }
					</MenuItem>
					{ this.props.isServiceProvider && this.props.goal.active === false ? (
					<MenuItem eventKey="3" className='c-goal-dropdown__menu-li' onClick={ () => this.props.markGoalActive() }>
						Approve goal
					</MenuItem>	
					) : null }
				</CustomMenu>
			</Dropdown>
		)
	}
}

export default withRouter(GoalDropdown);
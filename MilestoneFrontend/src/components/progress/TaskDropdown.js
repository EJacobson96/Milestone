/////////////////////////////////////////
/// Package imports

import React, { Component, ReactDOM } from 'react';
import { Link } from 'react-router-dom';
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
import '../../css/progress/TaskDropdown.css';
import threeDotImg from '../../img/task3dot.png';

/////////////////////////////////////////
/// Code

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
			<div className="dropdown-menu c-task-dropdown__dropdown-menu" style={{ padding: '' }}>
				<ul className="list-unstyled">
					{React.Children.toArray(children).filter(
					child => !value.trim() || child.props.children.indexOf(value) !== -1
					)}
				</ul>
			</div>
		);
	}
}
  
class TaskDropdown extends React.Component {
	constructor(props, context) {
		super(props, context);

		this.state = {
		};
	}

	render() {
		return (
			<Dropdown className='c-task-dropdown' id='task-dropdown'>
				<CustomToggle bsRole="toggle">
					<img src={ threeDotImg } className='c-task-dropdown__img' />
				</CustomToggle>
			
				<CustomMenu bsRole="menu">
					<MenuItem eventKey="1" className='c-task-dropdown__menu-li' onClick={ () => this.props.editTask() }>
						Edit Task
					</MenuItem>
					<hr className='c-task-dropdown__divider' />
					<MenuItem eventKey="2" className='c-task-dropdown__menu-li' onClick={ () => this.props.markTaskComplete() }>
						Mark Task Complete
					</MenuItem>
				</CustomMenu>
			</Dropdown>
		)
	}
}

export default TaskDropdown;
/////////////////////////////////////////
/// Dev Notes

import React, { Component } from 'react';
import Axios from 'axios';
import { Redirect, Route, Switch, withRouter } from 'react-router-dom';

/////////////////////////////////////////
/// Standard Components

import HeaderBar from '../ux/HeaderBar';

/////////////////////////////////////////
/// Images & Styles

/////////////////////////////////////////
/// Code

const NewGoalCategory = (props) => {

	return (
		<div>
			<HeaderBar 
				text={ 'New Goal Category' }
			/>
			Okay
		</div>
	)
};

export default NewGoalCategory;
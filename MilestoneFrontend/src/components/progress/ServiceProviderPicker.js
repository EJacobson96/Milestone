/////////////////////////////////////////
/// Package imports

import React, { Component } from 'react';
import { Redirect, Route, Switch, withRouter } from 'react-router-dom';
import { Glyphicon } from 'react-bootstrap';

/////////////////////////////////////////
/// Dev Notes

	/*
	 * 
	 */

/////////////////////////////////////////
/// Standard Components

/////////////////////////////////////////
/// Images & Styles
import '../../css/progress/ServiceProviderPicker.css';
import fakeUser from '../../img/fakeuser.png';

/////////////////////////////////////////
/// Code

const Progress = (props) => {

	const selectProvider = (providerId) => {
		let targetDivId = 'badge-id-' + providerId;
		let targetDiv = document.getElementById(targetDivId);
		if (!targetDiv.style.display || targetDiv.style.display == "none") {
			targetDiv.style.display = "block";
			props.handleServiceProviderSelection(providerId, true);
		} else {
			targetDiv.style.display = "none";
			props.handleServiceProviderSelection(providerId, false);
		}
	}

	var currConnections = <div></div>;
	if (props.currUser.connections) {
		currConnections = props.currUser.connections.map((connection) => {
			let connectionName = connection.firstName + ' ' + connection.lastName.charAt(0) + '.';
			let providerSelectedStyle = { display: 'none' };
			if (props.selectedProviders) {
				for (let i = 0; i < props.selectedProviders.length; i++) {
					if (connection.id === props.selectedProviders[i]) {
						providerSelectedStyle = { display: 'block' };
					}
				}
			}
			return (
				<div className='c-provider-picker__provider-wrapper' key={ connection.id } onClick={ () => selectProvider(connection.id) }>
					<img src={ fakeUser } className='c-provider-picker__provider-img'/>
					<p className='c-provider-picker__provider-name'>{ connectionName }</p>
					<div className='c-provider-picker__selected-badge' id={ 'badge-id-' + connection.id } style={ providerSelectedStyle }>
						<Glyphicon glyph='ok' className='c-provider-picker__check'/>
					</div>
				</div>
			);
		});
	}

	return (
		<div className='c-provider-picker'>
			{ currConnections }
		</div>
	)
}

export default Progress;
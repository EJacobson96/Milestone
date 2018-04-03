/////////////////////////////////////////
/// Dev Notes

import React from 'react';

/////////////////////////////////////////
/// Standard Components

/////////////////////////////////////////
/// Images & Styles

import '../../css/HeaderBar.css';

/////////////////////////////////////////
/// Code

const HeaderBar = (props) => {
	return (
		<div className="c-header-bar">
			<div className="c-header-bar__wrapper">
				<h3 className="c-header-bar__text">{ props.text }</h3>
			</div>
		</div>
	);
}

export default HeaderBar;
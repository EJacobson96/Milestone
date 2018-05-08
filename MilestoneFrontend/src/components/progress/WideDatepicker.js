/////////////////////////////////////////
/// Dev Notes

import React from 'react';
import { FormGroup, FormControl, ControlLabel, Glyphicon, InputGroup, Button } from 'react-bootstrap';
import moment from 'moment';
import DatePicker from 'react-datepicker';

/////////////////////////////////////////
/// Standard Components

import HeaderBar from '../ux/HeaderBar';

/////////////////////////////////////////
/// Images & Styles

import 'react-datepicker/dist/react-datepicker-cssmodules.css';
import '../../css/progress/WideDatepicker.css';


/////////////////////////////////////////
/// Code

class WideDatepicker extends React.Component {
	constructor (props) {
		super(props);
		this.state = {}
	}
	render() {
		return(
			<InputGroup>
				<FormControl onClick={this.props.onClick} value={this.props.value} onChange={this.props.onChange} disabled={this.props.disabled} />
				<InputGroup.Button>
					<Button onClick={this.props.onClick} disabled={this.props.disabled}><Glyphicon glyph="calendar" /></Button>
				</InputGroup.Button>
			</InputGroup>
		);
	}
};
  
export default WideDatepicker
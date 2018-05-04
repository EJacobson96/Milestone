/////////////////////////////////////////
/// Package imports

import React, { Component } from 'react';
import { FormGroup, FormControl, ControlLabel, Glyphicon } from 'react-bootstrap';

/////////////////////////////////////////
/// Dev Notes

	/*
	 * This component has state in order to manage the goal inputs and to
	 * add and keep track of initial goals to pass back to the controller. 
	 * Other state should be kept to a minimum.
	 */

/////////////////////////////////////////
/// Standard Components


/////////////////////////////////////////
/// Images & Styles
import '../../css/progress/GoalComments.css';
import fakeuser from '../../img/fakeuser.png';

/////////////////////////////////////////
/// Code

class GoalComments extends React.Component {
	constructor (props) {
		super(props);
		this.state = {
			commentValue: "",
		};
		this.handleCommentChange = this.handleCommentChange.bind(this);
	}

	componentWillMount() {
		// this.props.refreshUser();
	}

	handleCommentChange(e) {
		this.setState({
			commentValue: e.target.value
		});
	}

	handleCommentSubmit(e) {
		this.props.submitComment(this.state.commentValue, this.props.id);
	}
	
	render() {
		return (
			<div className={ 'c-goal-comments' } id={ 'comments-id-' + this.props.id } style={{display: 'none'}}>
			<div className='c-goal-comments__input-wrapper'>
				<div className='c-goal-comments__avatar-flex-block'>
					<img src={ fakeuser } className='c-goal-comments__user-avatar' />
				</div>
				<div className='c-goal-comments__input-flex-block'>
					<form>
						<FormGroup
							controlId="goalCommentInput"
							// validationState={this.getValidationState()}
						>
							<div className="input-group">
								<FormControl
									type="text"
									value={ this.state.commentValue }
									placeholder="Comment..."
									onChange={ (e) => this.handleCommentChange(e) }
									className='c-goal-comments__input'
								/>
								<span className="input-group-addon" id="basic-addon1">
									<Glyphicon glyph="circle-arrow-right" onClick={(e) => this.handleCommentSubmit(e)} />
								</span>
							</div>							
							<FormControl.Feedback />
						</FormGroup>
					</form>

				</div>
			</div>
		</div>

		)
	}
}

export default GoalComments;
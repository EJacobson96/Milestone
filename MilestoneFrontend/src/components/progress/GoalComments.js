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
		e.preventDefault();
		if (this.state.commentValue !== "") {
			this.props.submitComment(this.state.commentValue, this.props.id);
		}
		this.setState({
			commentValue: ""
		});
	}
	
	render() {
		console.log(this.props.goal.comments);
		console.log(this.props.currUser);

		let comments = "";
		if (this.props.goal.comments) {
			comments = this.props.goal.comments.map((comment) => {
				if (comment.creator == this.props.currUser.id) {
					return (
						<div className='c-goal-comments__comment-from-user'>
							<div className='c-goal-comments__comment-from-user__avatar-flex-box'>
								<img src={ fakeuser } className='c-goal-comments__user-avatar' />
							</div>
							<div className='c-goal-comments__comment-from-user__text-flex-box'>
								<p className='c-goal-comments__comment-from-user__text'>{ comment.textBody }</p>
							</div>
						</div>
					)
				}
			});
		}
		return (
			<div className={ 'c-goal-comments' } id={ 'comments-id-' + this.props.id }>
				{ comments }

				<div className='c-goal-comments__input-wrapper'>
					<div className='c-goal-comments__avatar-flex-block'>
						<img src={ fakeuser } className='c-goal-comments__user-avatar' />
					</div>
					<div className='c-goal-comments__input-flex-block'>
						<form onSubmit={ (e) => this.handleCommentSubmit(e) }>
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
										autoComplete='off'
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
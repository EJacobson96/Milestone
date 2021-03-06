/////////////////////////////////////////
/// Package imports

import React, { Component } from 'react';
import { FormGroup, FormControl, ControlLabel, Glyphicon } from 'react-bootstrap';

/////////////////////////////////////////
/// Dev Notes

	/*
	 * This component has state in order to manage the task inputs and to
	 * add and keep track of initial task to pass back to the controller. 
	 * Other state should be kept to a minimum.
	 */

/////////////////////////////////////////
/// Standard Components


/////////////////////////////////////////
/// Images & Styles
import '../../css/progress/TaskComments.css';
import fakeuser from '../../img/fakeuser.png';

/////////////////////////////////////////
/// Code

// A component for displaying and adding comments attached to a current task. Acts
// as a sub-component of Task.js.
class TaskComments extends React.Component {
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

	// Handles storing the current user input in state when the user is typing
	// a comment to be added to the task.
	handleCommentChange(e) {
		this.setState({
			commentValue: e.target.value
		});
	}

	// Handles the submission of a new comment to be attached to the task. Passes
	// the currently stored input from state and the current task's id from props
	// upwards to ProgressController to be stored on the server, then clears
	// the comment input field.
	handleCommentSubmit(e) {
		e.preventDefault();
		if (this.state.commentValue !== "") {
			this.props.submitComment(this.state.commentValue, this.props.taskId);
		}
		this.setState({
			commentValue: ""
		});
	}
	
	render() {
		let comments = "";
		if (this.props.task.comments) {
			comments = this.props.task.comments.map((comment) => {
				if (comment.creator == this.props.currUser.id) {
					return (
						<div className='c-task-comments__comment'>
							<div className='c-task-comments__comment__avatar-flex-box'>
								<img src={ fakeuser } className='c-task-comments__user-avatar' />
							</div>
							<div className='c-task-comments__comment-from-user__text-flex-box'>
								<p className='c-task-comments__comment__text'>{ comment.textBody }</p>
							</div>
						</div>
					)
				} else {
					return (
						<div className='c-task-comments__comment'>
							<div className='c-task-comments__comment-from-other__text-flex-box'>
								<p className='c-task-comments__comment__text'>{ comment.textBody }</p>
							</div>
							<div className='c-task-comments__comment__avatar-flex-box'>
								<img src={ fakeuser } className='c-task-comments__user-avatar' />
							</div>
						</div>
					)
				}
			});
		}
		return (
			<div className={ 'c-task-comments' } id={ 'comments-id-' + this.props.taskId }>
				{ comments }
				<div className='c-task-comments__input-wrapper'>
					<div className='c-task-comments__avatar-flex-block'>
						<img src={ fakeuser } className='c-task-comments__user-avatar' />
					</div>
					<div className='c-task-comments__input-flex-block'>
						<form onSubmit={ (e) => this.handleCommentSubmit(e) }>
							<FormGroup
								controlId="taskCommentInput"
								// validationState={this.getValidationState()}
							>
								<div className="input-group">
									<FormControl
										type="text"
										value={ this.state.commentValue }
										placeholder="Comment..."
										onChange={ (e) => this.handleCommentChange(e) }
										className='c-task-comments__input'
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

export default TaskComments;
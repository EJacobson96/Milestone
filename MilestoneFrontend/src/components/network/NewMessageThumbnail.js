/////////////////////////////////////////
/// Pre-baked Components
import React from 'react';
import { withRouter, Link } from 'react-router-dom';

/////////////////////////////////////////
/// Images & Styles
import '../../css/network/NewMessageThumbnail.css';

/////////////////////////////////////////
/// Code

//displays a card representing a new message thread
function NewMessageThumbnail(props) {
    var memberNames;
    var thumbnailClasses = "c-message-thumbnail-name ";
    if (props.members && props.currUser) {
        if (props.existing) {
            thumbnailClasses += "c-message-existing-conversation";
        } else {
            thumbnailClasses += "c-message-not-existing-conversation";
        }
        memberNames = "";
        for (let i = 0; i < props.members.length; i++) {
            if (props.members[i].id !== props.currUser.id && memberNames !== "") {
                memberNames += ", " + props.members[i].fullName;
            } else if (props.members[i].id !== props.currUser.id) {
                memberNames += props.members[i].fullName;
            }
        }
    }
    return (
        <div className="l-new-message">
            <Link 
                to={{
                    pathname: props.path
                }}
                className='c-message-card-link-wrapper' 
                key={ props.id }
            >
                <div className="c-message-thumbnail" key={ props.id } >
                    <div className={thumbnailClasses}>
                        { memberNames }
                    </div>
                </div>
            </Link>
        </div>
    );
}

export default withRouter(NewMessageThumbnail);
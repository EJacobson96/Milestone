/////////////////////////////////////////
/// Pre-baked Components
import React from 'react';
import { withRouter, Link } from 'react-router-dom';

/////////////////////////////////////////
/// Images & Styles
import '../../css/NewMessageThumbnail.css';

/////////////////////////////////////////
/// Code

class NewMessageThumbnail extends React.Component {
    constructor(props) {
        super(props);
    
        this.state = {
        };
    }

    render() {
        var memberNames;
        var thumbnailClasses = "c-message-thumbnail-name ";
        if (this.props.members && this.props.currUser) {
            if (this.props.existing) {
                thumbnailClasses += "c-message-existing-conversation";
            } else {
                thumbnailClasses += "c-message-not-existing-conversation";
            }
            memberNames = "";
            for (let i = 0; i < this.props.members.length; i++) {
                let memberLength = this.props.members.length;
                if (this.props.members[i].id != this.props.currUser.id && memberNames != "") {
                    memberNames += ", " + this.props.members[i].fullName;
                } else if (this.props.members[i].id != this.props.currUser.id) {
                    memberNames += this.props.members[i].fullName;
                }
            }
        }
        return (
            <div className="l-new-message">
                <Link 
                    to={{
                        pathname: this.props.path
                    }}
                    className='c-message-card-link-wrapper' 
                    key={ this.props.id }
                >
                    <div className="c-message-thumbnail" key={ this.props.id } >
                        <div className={thumbnailClasses}>
                            { memberNames }
                        </div>
                    </div>
                </Link>
            </div>
        );
    }
}

export default withRouter(NewMessageThumbnail);
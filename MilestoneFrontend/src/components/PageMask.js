/////////////////////////////////////////
/// Pre-baked Components
import React from 'react';

/////////////////////////////////////////
/// Images & Styles
import '../css/PageMask.css';

/////////////////////////////////////////
/// Code

class PageMask extends React.Component {
    constructor(props) {
        super(props);
    
        this.state = {
            value: ''
        };
    }

    render() {
        return (
            <div className="c-page-mask">
                
            </div>
        );
    }
}

export default PageMask;
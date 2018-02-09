import React, { Component } from 'react';

import '../css/PageMask.css';

class PageMask extends React.Component {
    constructor(props) {
        super(props);
    
        this.state = {
            value: ''
        };
    }

    render() {
        return (
            <div className="page-mask">
                
            </div>
        );
    }
}

export default PageMask;
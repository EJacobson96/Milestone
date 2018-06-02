/////////////////////////////////////////
/// Package imports

import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import Axios from 'axios';

/////////////////////////////////////////
/// Images & Styles

import threeDotImg from '../../img/task3dot.png';
import '../../css/progress/ResourceCategory.css';

/////////////////////////////////////////
/// Code

// A component which displays a selected Resource category for a logged
// in service provider.
class ResourceCategory extends Component {
    constructor(props) {
        super(props);

        this.state = {
            resources: []
        };
    }

    componentDidMount() {
        this.props.goalController.getSpecificResource(this.props.match.params.id)
        .then((data) => {
            this.setState({
                resourceCategory: data,
                resources: data.resources
            })
        })
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.resources && this.props.resources.length > 0) {
            this.setState({
                resources: this.props.resources,
            })
        } else if (nextProps.match.params.id !== this.props.match.params.id) {
            this.props.goalController.getSpecificResource(nextProps.match.params.id)
            .then((data) => {
                this.setState({
                    resourceCategory: data,
                    resources: data.resources
                })
            })
        }
    }

    // Handles the creation of a new resource on user input.
    handleFormSubmit(event) {
        event.preventDefault();
        let titleInput = document.getElementById("titleInput");
        let nameInput = document.getElementById("resourceName");
        let title = titleInput.value;
        let name = nameInput.value;
        titleInput.value = "";
        nameInput.value = "";
        let resource = {
            Title: title,
            ResourceName: name
        }
        let resources = this.state.resources;
        resources.push(resource);
        Axios.patch(
            'https://api.milestoneapp.org/resources?id=' + this.state.resourceCategory.id,
            {
                Resources: resources
            })
            .then(response => {
                return response.data;
                
            })
            .then((data) => {
                console.log(data);
                this.setState({
                    resources: data.resources
                })
            }) 
            .catch(error => {
                console.log(error);
            });
    }

    // Handles the deletion of a specific resource identified by the 'id' parameter
    // on user input.
    deleteResource(e, id) {
        e.preventDefault();
        let resources = this.state.resources.filter((resource) => {
            return resource.id !== id;
        })
        Axios.patch(
            'https://api.milestoneapp.org/resources?id=' + this.state.resourceCategory.id,
            {
                Resources: resources
            })
            .then(response => {
                return response.data;
                
            })
            .then((data) => {
                console.log(data);
                this.setState({
                    resources: data.resources
                })
            }) 
            .catch(error => {
                console.log(error);
            });
    }

    render() {
        return (
            <div className="c-resources-container">
                {
                    this.state.resources.map((resource) => {
                        return  <div key={resource.id} className="c-resource">
                                    <img src={threeDotImg} className="c-resource-dots" id={resource.id} data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" /> 
                                    <div className="dropdown-menu resourceDropdown" aria-labelledby={resource.id}>
                                        <a onClick={(e) => this.deleteResource(e, resource.id)} className="dropdown-item" href="#">Delete</a>
                                    </div>
                                    <p className="c-resource-title">{resource.title}</p>
                                    <p className="c-resource-body">{resource.resourceName}</p>
                                </div>
                    })
                }
                <div className="modal fade" id="newResource" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Create New Resource</h5>
                            </div>
                            <div className="modal-body">
                                <form> 
                                    <div className="form-group">
                                        <label htmlFor="titleInput">Resource Title</label>
                                        <input className="form-control" id="titleInput" name="title" type="text" placeholder="Resource Title"/>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="resourceName">Resource</label>
                                        <input className="form-control" id="resourceName" name="title" type="text" placeholder="Resource"/>
                                    </div>
                                    <div className="c-modal-button-container">
                                        <button type="button" className="btn c-modal-button" data-dismiss="modal">Cancel</button>
                                        <button className="btn c-modal-button" onClick={(e) => this.handleFormSubmit(e)} data-dismiss="modal">Submit</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(ResourceCategory);
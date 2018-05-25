import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import Axios from 'axios';

import '../../css/progress/ResourceCategories.css';

class ResourceCategories extends Component {
    constructor(props) {
        super(props);

        this.state = {
            resourceCategories: []
        }
    }

    handleFormSubmit(event) {
        event.preventDefault();
        let input = document.getElementById("titleInput").value;
        Axios.post(
            'https://api.milestoneapp.org/resources',
            {
                Title: input,
                UserID: this.props.currUser.id
            })
            .then(response => {
                return response.data;
                
            })
            .then(() => {
                this.getResources();
            }) 
            .catch(error => {
                console.log(error);
            });
    }

    componentDidMount() {
        console.log("hello");
        this.setState({
            resourceCategories: this.props.resourceCategories
        })
    }

    render() {
        return (
            <div className="c-resource-category-container">
                {
                    this.props.resourceCategories.map((category) => {
                        return <Link to={`/progress/resources/categories/${category.id}`}  key={category.id} className="c-resource-category-link">
                            <div className="c-resource-category">
                                <p>{category.title}</p>
                            </div>
                        </Link>
                    })
                }
                <div className="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Create New Category</h5>
                            </div>
                            <div className="modal-body">
                                <form> 
                                    <div className="form-group">
                                        <label for="titleInput">Category Title</label>
                                        <input className="form-control" id="titleInput" name="title" type="text" placeholder="Category Title"/>
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

export default ResourceCategories;
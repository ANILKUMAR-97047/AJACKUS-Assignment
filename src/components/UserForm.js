import React, { Component } from "react";
import "./UserForm.css";

class UserForm extends Component {
  state = {
    id: "",
    name: "",
    email: "",
  };

  componentDidUpdate(prevProps) {
    if (
      prevProps.selectedUser !== this.props.selectedUser &&
      this.props.selectedUser
    ) {
      this.setState({ ...this.props.selectedUser });
    }
  }

  componentDidMount() {
    if (this.props.selectedUser) {
      this.setState({ ...this.props.selectedUser });
    }
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.onSave(this.state);
  };

  render() {
    const { name, email } = this.state;
    return (
      <div className="user-form">
        <h2>{this.props.selectedUser ? "Edit User" : "Add User"}</h2>
        <form onSubmit={this.handleSubmit}>
          <div className="input-container">
            <input
              type="text"
              name="name"
              id="name"
              placeholder=" "
              value={name}
              onChange={this.handleChange}
              required
            />
            <label htmlFor="name">Name</label>
          </div>
          <div className="input-container">
            <input
              type="email"
              name="email"
              id="email"
              placeholder=" "
              value={email}
              onChange={this.handleChange}
              required
            />
            <label htmlFor="email">Email</label>
          </div>
          <div className="form-actions">
            <button type="submit" className="save-btn">
              {this.props.selectedUser ? "Update" : "Add"}
            </button>
            <button
              type="button"
              className="cancel-btn"
              onClick={this.props.onCancel}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export default UserForm;

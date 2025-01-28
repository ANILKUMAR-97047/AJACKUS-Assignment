import React, { Component } from "react";
import axios from "axios";
import Swal from "sweetalert2";

import "./App.css";
import UserForm from "./components/UserForm";
import UserList from "./components/UserList";

class App extends Component {
  state = {
    users: [],
    displayedUsers: [],
    selectedUser: null,
    error: null,
    isLoading: false,
    isModalOpen: false,
    currentPage: 1,
    usersPerPage: 5,
    itemsPerPageOptions: [5, 10, 15, 20],
    lastCustomId: 0,
  };

  componentDidMount() {
    this.fetchUsers();
  }

  fetchUsers = async () => {
    this.setState({ isLoading: true });
    try {
      const response = await axios.get(
        "https://jsonplaceholder.typicode.com/users"
      );

      const usersWithCustomId = response.data.map((user, index) => ({
        ...user,
        customId: index + 1,
      }));

      this.setState(
        {
          users: usersWithCustomId,
          lastCustomId: usersWithCustomId.length,
          error: null,
          isLoading: false,
        },
        () => this.paginateUsers()
      );
    } catch (error) {
      this.setState({
        error: "Failed to fetch users. Please try again later.",
        isLoading: false,
      });
      Swal.fire("Error", "Failed to fetch users", "error");
    }
  };

  paginateUsers = () => {
    const { users, currentPage, usersPerPage } = this.state;
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const displayedUsers = users.slice(indexOfFirstUser, indexOfLastUser);
    this.setState({ displayedUsers });
  };

  handlePageChange = (pageNumber) => {
    this.setState({ currentPage: pageNumber }, () => this.paginateUsers());
  };

  handleItemsPerPageChange = (event) => {
    const newUsersPerPage = parseInt(event.target.value);
    this.setState(
      {
        usersPerPage: newUsersPerPage,
        currentPage: 1,
      },
      () => this.paginateUsers()
    );
  };

  handleAddUser = (user) => {
    const { users, lastCustomId } = this.state;
    const newCustomId = lastCustomId + 1;

    const newUser = {
      ...user,
      id: Date.now(),
      customId: newCustomId,
    };

    const updatedUsers = [...users, newUser];
    const totalPages = Math.ceil(updatedUsers.length / this.state.usersPerPage);

    this.setState(
      {
        users: updatedUsers,
        lastCustomId: newCustomId,
        currentPage: totalPages,
        isModalOpen: false,
      },
      () => {
        this.paginateUsers();
        Swal.fire({
          icon: "success",
          title: "User Added",
          text: "New user has been successfully added!",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    );
  };

  handleEditUser = (updatedUser) => {
    const updatedUsers = this.state.users.map((user) =>
      user.id === updatedUser.id
        ? { ...updatedUser, customId: user.customId }
        : user
    );

    this.setState(
      {
        users: updatedUsers,
        isModalOpen: false,
      },
      () => {
        this.paginateUsers();
        Swal.fire({
          icon: "success",
          title: "User Updated",
          text: "User information has been successfully updated!",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    );
  };

  handleDeleteUser = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        const filteredUsers = this.state.users.filter((user) => user.id !== id);
        const totalPages = Math.ceil(
          filteredUsers.length / this.state.usersPerPage
        );
        const newCurrentPage = Math.min(this.state.currentPage, totalPages);

        this.setState(
          {
            users: filteredUsers,
            currentPage: newCurrentPage || 1,
          },
          () => {
            this.paginateUsers();
            Swal.fire({
              icon: "success",
              title: "Deleted!",
              text: "User has been deleted.",
              showConfirmButton: false,
              timer: 1500,
            });
          }
        );
      }
    });
  };

  openModal = (user = null) => {
    this.setState({
      isModalOpen: true,
      selectedUser: user,
    });
  };

  closeModal = () => {
    this.setState({
      isModalOpen: false,
      selectedUser: null,
    });
  };

  render() {
    const {
      displayedUsers,
      error,
      isLoading,
      isModalOpen,
      selectedUser,
      currentPage,
      users,
      usersPerPage,
      itemsPerPageOptions,
    } = this.state;

    const totalPages = Math.ceil(users.length / usersPerPage);
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;

    return (
      <div className="App">
        <div className="content-wrapper">
          <div className="main-content">
            <center>
              <h1 style={{ fontWeight: "bold" }}>USER MANAGEMENT DASHBOARD</h1>
            </center>
            {error && <p className="error">{error}</p>}

            {isLoading ? (
              <div className="loader">
                <div className="spinner"></div>
              </div>
            ) : (
              <>
                <div className="pagination-controls">
                  <div className="pagination-info">
                    Showing {users.length > 0 ? indexOfFirstUser + 1 : 0} to{" "}
                    {Math.min(indexOfLastUser, users.length)} of {users.length}{" "}
                    items
                  </div>

                  <div className="items-per-page">
                    <label htmlFor="itemsPerPage">Items per page: </label>
                    <select
                      id="itemsPerPage"
                      value={usersPerPage}
                      onChange={this.handleItemsPerPageChange}
                      className="items-per-page-select"
                    >
                      {itemsPerPageOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <button
                  onClick={() => this.openModal()}
                  className="add-user-btn"
                >
                  + Add New User
                </button>
                <UserList
                  users={displayedUsers}
                  onEditUser={(user) => this.openModal(user)}
                  onDeleteUser={this.handleDeleteUser}
                />
              </>
            )}
          </div>
        </div>
        {!isLoading && (
          <div className="pagination-wrapper">
            <div className="pagination">
              <button
                onClick={() => this.handlePageChange(1)}
                disabled={currentPage === 1}
                className="pagination-button"
              >
                First
              </button>
              <button
                onClick={() => this.handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="pagination-button"
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((page) => {
                  const delta = 2;
                  return (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - delta && page <= currentPage + delta)
                  );
                })
                .map((page, index, array) => {
                  if (index > 0 && page - array[index - 1] > 1) {
                    return (
                      <React.Fragment key={`ellipsis-${page}`}>
                        <span className="pagination-ellipsis">...</span>
                        <button
                          onClick={() => this.handlePageChange(page)}
                          className={currentPage === page ? "active" : ""}
                        >
                          {page}
                        </button>
                      </React.Fragment>
                    );
                  }
                  return (
                    <button
                      key={page}
                      onClick={() => this.handlePageChange(page)}
                      className={currentPage === page ? "active" : ""}
                    >
                      {page}
                    </button>
                  );
                })}

              <button
                onClick={() => this.handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="pagination-button"
              >
                Next
              </button>
              <button
                onClick={() => this.handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
                className="pagination-button"
              >
                Last
              </button>
            </div>
          </div>
        )}

        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal-container">
              <div className="modal-content">
                <span className="close-btn" onClick={this.closeModal}>
                  &times;
                </span>
                <UserForm
                  selectedUser={selectedUser}
                  onSave={(user) => {
                    selectedUser
                      ? this.handleEditUser(user)
                      : this.handleAddUser(user);
                  }}
                  onCancel={this.closeModal}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default App;

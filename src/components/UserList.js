import React from 'react';
import './UserList.css';
import { FiEdit, FiTrash2 } from "react-icons/fi";
const UserList = ({ users, onEditUser, onDeleteUser }) => (
  <div className="user-list">
    <h2>Users List</h2>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Email</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr  className='user-details' key={user.id}>
            <td style={{textAlign:"center"}}>{user.customId || user.id}</td>
            <td>{user.name}</td>
            <td>{user.email}</td>
            <td style={{display:"flex", justifyContent:"center"}}>
              <button onClick={() => onEditUser(user)} className="edit-btn action-btn"><FiEdit/></button>
              <button onClick={() => onDeleteUser(user.id)} className="delete-btn action-btn"><FiTrash2/></button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default UserList;

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setWork } from '../redux/workSlice';
import { logout } from '../redux/authSlice'; // Import the logout action
import { setUsers } from '../redux/usersSlice';
import api from '../utils/api';
import axios from 'axios';
import { API } from '../utils/constants';

const WorkBoardList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const workBoards = useSelector((store) => store.work.work);
  const token = useSelector((store) => store.auth.auth.access_token);

  useEffect(() => {
    const fetchWorkBoards = async () => {
      try {
        const response = await api.get("app/workboard/");
        console.log("workboard lists-->", response)
        dispatch(setWork(response.data));
      } catch (error) {
        console.error('Error fetching workboards:', error);
      }
    };

    fetchWorkBoards();
  }, [dispatch]);


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(API+'auth/users/',
          {
                  headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                  },
                });
         // Replace with your actual API endpoint
        dispatch(setUsers(response.data)); // Assuming the response contains an array of users
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);

  const handleCreateBoard = () => {
    navigate('/board');
  };

  const handleWorkBoardClick = (workBoardId) => {
    navigate(`/board/my-workboards/${workBoardId}`);
  };

  const handleLogout = () => {
    // Dispatch logout action
    dispatch(logout());

    // Redirect to login page
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center p-6 border-b bg-white shadow-sm">
        <h1 className="text-3xl font-bold text-gray-800">My WorkBoards</h1>
        <div className="flex items-center space-x-6">
          <p className="text-gray-500">Assigned to Me</p>
          <button
            onClick={handleLogout} // Call handleLogout on click
            className="text-gray-500 hover:text-gray-900"
          >
            Logout
          </button>
          <div className="w-10 h-10 bg-green-200 rounded-full flex justify-center items-center">
            <span className="text-white font-bold">Y</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex space-x-6">
        {/* Create New Board Card */}
        <button
          onClick={handleCreateBoard}
          className="bg-white shadow-lg rounded-lg w-64 h-40 flex justify-center items-center border-2 border-gray-300 hover:border-indigo-400"
        >
          <span className="text-6xl text-gray-400 font-light">+</span>
        </button>

        {/* Dynamically render the fetched WorkBoard lists */}
        {workBoards.map((workBoard) => (
          <div
            key={workBoard.id}
            className="bg-yellow-200 shadow-lg rounded-lg w-64 h-40 p-4 flex flex-col justify-between cursor-pointer hover:bg-yellow-300"
            onClick={() => handleWorkBoardClick(workBoard.id)} // Pass workBoardId on click
          >
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                {workBoard.title}
              </h2>
              <p className="text-gray-600 text-sm mt-2">
                {workBoard.tasks.length} Task{workBoard.tasks.length !== 1 && 's'}
              </p>
            </div>
            <div className="flex flex-col space-y-2 mt-4">
              {workBoard.tasks.map((task) => (
                <p key={task.id} className="text-sm text-gray-600">
                  {task.title} - {task.status}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkBoardList;


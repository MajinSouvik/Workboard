import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TaskInput from './TaskInput';
import EditableTask from './EditableTask';
import axios from 'axios';
import { API } from "../utils/constants";
import api from '../utils/api';
import { useSelector } from 'react-redux'; // Assuming you're using Redux to manage authentication

const WorkBoard = () => {
  const navigate = useNavigate();
  const [boardName, setBoardName] = useState('');
  const [boardDescription, setBoardDescription] = useState('');
  const [tasks, setTasks] = useState([]);
  const [isAddingTask, setIsAddingTask] = useState(false);

  // Get the token from Redux store or localStorage
  const token = useSelector((state) => state.auth.auth.access_token); // Replace `state.auth.token` with how you're storing the token
    
  const handleAddTask = (e) => {
    e.preventDefault();
    setIsAddingTask(true);
  };

  const handleSaveTask = (taskData) => {
    console.log("Task saved:", taskData); // Debugging log
    setTasks([...tasks, taskData]); // Add new task to the array
    setIsAddingTask(false); // After saving, close TaskInput and show "Add a Task" button again
  };

  const handleEditTask = (editedTask, index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index] = editedTask;
    setTasks(updatedTasks);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const workBoardData = {
      title: boardName,
      description: boardDescription,
      tasks: tasks.map((task) => ({
        title: task.title,
        description: task.description,
        assigned_to: task.assigneeID,
        status: task.status,
      })),
    };

    console.log("workBoardData-->", workBoardData)

    try {
      // const response = await axios.post(
      //   API + 'app/workboard/', 
      //   workBoardData, 
      //   {
      //     headers: {
      //       'Authorization': `Bearer ${token}`,
      //       'Content-Type': 'application/json',
      //     },
      //   }
      // );
      const response = await api.post(
        'app/workboard/', // The endpoint relative to the baseURL set in api.js
        workBoardData
      );
      console.log('Board Created:', response.data);
      navigate('/');
    } catch (error) {
      console.error('Error creating workboard:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center p-6 border-b bg-white shadow-sm">
        <h1 className="text-3xl font-bold text-gray-800">Create a WorkBoard</h1>
        <div className="flex items-center space-x-6">
          <button className="text-gray-500 hover:text-gray-900">Logout</button>
          <div className="w-10 h-10 bg-green-200 rounded-full flex justify-center items-center">
            <span className="text-white font-bold">Y</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col items-start p-6 space-y-6">
        <form onSubmit={handleSubmit} className="w-full max-w-2xl space-y-4">
          <input
            type="text"
            placeholder="Name your Board"
            value={boardName}
            onChange={(e) => setBoardName(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
            required
          />
          <textarea
            placeholder="Board description"
            value={boardDescription}
            onChange={(e) => setBoardDescription(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
            rows="3"
          />
          
          {/* Render editable tasks */}
          {tasks.length > 0 && tasks.map((task, index) => (
            <EditableTask
              key={index}
              task={task}
              onEdit={(editedTask) => handleEditTask(editedTask, index)}
            />
          ))}

          {/* Add task button or TaskInput */}
          {isAddingTask ? (
            <TaskInput onSave={(taskData) => {
              console.log("onSave called with:", taskData); // Debugging log
              handleSaveTask(taskData);
            }} />
          ) : (
            <button
              type="button"
              onClick={handleAddTask}
              className="w-full p-3 border border-dashed border-gray-300 rounded-lg text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              + Add a Task
            </button>
          )}

          <button
            type="submit"
            className="w-full p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
          >
            Create Work Board
          </button>
        </form>
      </div>
    </div>
  );
};

export default WorkBoard;


// import React, { useState } from 'react';

// const TaskInput = ({ onSave }) => {
//   const [title, setTitle] = useState('');
//   const [description, setDescription] = useState('');
//   const [assignee, setAssignee] = useState('');
//   const [status, setStatus] = useState('To-Do');

//   const handleSave = (e) => {
//     e.preventDefault(); // Prevent form refresh
//     if (title.trim() === '') return; // Prevent saving empty tasks
//     onSave({ title, description, assignee, status }); // Pass task data up to WorkBoard
//     setTitle(''); // Clear inputs after saving
//     setDescription('');
//     setAssignee('');
//     setStatus('To-Do');
//   };

//   return (
//     <div className="bg-white p-4 rounded-lg shadow-sm space-y-3">
//       <div>
//         <input
//           type="text"
//           placeholder="Task Title"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
//           required
//         />
//       </div>
//       <div>
//         <textarea
//           placeholder="Task Description (Optional)"
//           value={description}
//           onChange={(e) => setDescription(e.target.value)}
//           className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
//           rows="2"
//         />
//       </div>
//       <div>
//         <input
//           type="text"
//           placeholder="Assign others with @"
//           value={assignee}
//           onChange={(e) => setAssignee(e.target.value)}
//           className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
//         />
//       </div>
//       <div>
//         <select
//           value={status}
//           onChange={(e) => setStatus(e.target.value)}
//           className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
//         >
//           <option value="To-Do">To-Do</option>
//           <option value="In Progress">In Progress</option>
//           <option value="Done">Done</option>
//         </select>
//       </div>
//       <button
//         onClick={handleSave}
//         className="w-full p-2 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
//       >
//         Enter to Save & Add New Task
//       </button>
//     </div>
//   );
// };

// export default TaskInput;


import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Assuming you're using Axios for API calls
import { API } from '../utils/constants';
import { useSelector } from 'react-redux';


const TaskInput = ({ onSave }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignee, setAssignee] = useState("");
  const [assigneeID,setAssigneeID]=useState()
  const [status, setStatus] = useState('To-Do');
  const [users, setUsers] = useState([]); // For storing the list of users
  const [filteredUsers, setFilteredUsers] = useState([]); // For storing the filtered list of users
  const token=useSelector((store)=>store.auth.auth.access_token)

  // Fetch the list of users when the component mounts
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
        setUsers(response.data); // Assuming the response contains an array of users
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);

  const handleAssigneeChange = (e) => {
    const value = e.target.value;
    setAssignee(value);

    // Show suggestions only if the user types '@'
    if (value.includes('@')) {
      const query = value.split('@').pop(); // Get the part after '@'
      setFilteredUsers(
        users.filter((user) =>
          user.username.toLowerCase().includes(query.toLowerCase())
        )
      );
    } else {
      setFilteredUsers([]);
    }
  };

  const selectAssignee = (user) => {
    setAssignee(user.username); // Set the selected username with '@'
    setAssigneeID(user.id); // Set the selected
    setFilteredUsers([]); // Clear the suggestions after selection
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (title.trim() === '') return;
    onSave({ title, description, assigneeID, status });
    setTitle('');
    setDescription('');
    setAssignee('');
    setAssigneeID()
    setStatus('To-Do');
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm space-y-3">
      <div>
        <input
          type="text"
          placeholder="Task Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
          required
        />
      </div>
      <div>
        <textarea
          placeholder="Task Description (Optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
          rows="2"
        />
      </div>
      <div>
        <input
          type="text"
          placeholder="Assign others with @"
          value={assignee}
          onChange={handleAssigneeChange}
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        {/* Suggestion dropdown */}
        {filteredUsers.length > 0 && (
          <ul className="bg-white border border-gray-300 rounded max-h-40 overflow-y-auto mt-2">
            {filteredUsers.map((user) => (
              <li
                key={user.id}
                onClick={() => selectAssignee(user)}
                className="p-2 cursor-pointer hover:bg-gray-100"
              >
                {user.username}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          <option value="To-Do">To-Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
        </select>
      </div>
      <button
        onClick={handleSave}
        className="w-full p-2 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
      >
        Enter to Save & Add New Task
      </button>
    </div>
  );
};

export default TaskInput;


import React, { useState } from 'react';

const EditableTask = ({ task, onEdit }) => {
  console.log("Inside EditTask...");

  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState(task);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    onEdit(editedTask);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="w-full p-3 border border-purple-300 rounded-lg shadow-sm bg-purple-50">
        <input
          type="text"
          value={editedTask.title}
          onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
          className="w-full p-2 mb-2 border border-purple-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-purple-400"
        />
        <textarea
          value={editedTask.description}
          onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
          className="w-full p-2 mb-2 border border-purple-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-purple-400"
          rows="2"
        />
        <div className="flex justify-between items-center">
          <span className="text-sm text-purple-600">Status: {editedTask.status}</span>
          <button onClick={handleSave} className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600">
            Save
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-3 border border-purple-300 rounded-lg shadow-sm bg-purple-50">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold text-purple-800">{task.title}</h3>
        <button onClick={handleEdit} className="text-sm text-purple-500 hover:text-purple-700">
          Edit
        </button>
      </div>
      <p className="text-sm text-gray-600 mb-2">{task.description}</p>
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-600">Assigned to: {task.assignee}</span>
        <span className="text-sm text-gray-600">Status: {task.status}</span>
      </div>
    </div>
  );
};

export default EditableTask;

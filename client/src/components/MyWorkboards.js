import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useSelector } from "react-redux";
import { useParams } from 'react-router-dom';
import api from '../utils/api';
import { API } from '../utils/constants';
import axios from 'axios';

const MyWorkboards = () => {
    const { workBoardId } = useParams(); // Get workBoardId from route params
    const work = useSelector((store) => store.work.work);
    const selectedWorkBoard = work.find(board => board.id === parseInt(workBoardId)); // Find the specific workboard
    const token = useSelector((store) => store.auth.auth.access_token);
    const users=useSelector((store) => store.users.users)

    const [tasks, setTasks] = useState({
        'to-do': [],
        'in-progress': [],
        'completed': [],
    });

    const columnTitle = {
        'to-do': 'To-Do',
        'in-progress': 'In Progress',
        'completed': 'Completed',
    };

      const helper=(userID)=>{
        console.log("called")
        let username;
        for(let i=0; i<users.length; i++){
            if(users[i].id === userID){
                console.log("matched")
                username=users[i].username
                break
            }
        }
        return username
      }


    // Categorize tasks into the appropriate columns based on their status
    useEffect(() => {
        if (selectedWorkBoard) {
            const toDoTasks = [];
            const inProgressTasks = [];
            const completedTasks = [];

            selectedWorkBoard.tasks.forEach((task) => {
                const taskData = {
                    id: task.id,
                    title: task.title,
                    description: task.description,
                    userPhoto: task.userPhoto,
                    assigned_to:helper(task.assigned_to),
                    status: task.status
                };

                console.log("***",taskData)

                if (task.status === 'To-Do') {
                    toDoTasks.push(taskData);
                } else if (task.status === 'In Progress') {
                    inProgressTasks.push(taskData);
                } else if (task.status === 'Completed') {
                    completedTasks.push(taskData);
                }
            });

            setTasks({
                'to-do': toDoTasks,
                'in-progress': inProgressTasks,
                'completed': completedTasks,
            });
        }
    }, [selectedWorkBoard]);

    // Handle drag and drop
    

    
    const onDragEnd = async (result) => {
        console.log("onDrag end...");
        const { destination, source, draggableId } = result;
    
        if (!destination) return;
    
        // No change in position
        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }
    
        const startColumn = tasks[source.droppableId];
        const finishColumn = tasks[destination.droppableId];
    
        let newTask;
        if (startColumn === finishColumn) {
            // Moving within the same column
            const newTaskIds = Array.from(startColumn);
            const [movedTask] = newTaskIds.splice(source.index, 1);
            newTaskIds.splice(destination.index, 0, movedTask);
    
            newTask = {
                ...movedTask,
                status: columnTitle[destination.droppableId], // Update status based on column
            };
    
            const newState = {
                ...tasks,
                [source.droppableId]: newTaskIds,
            };
    
            setTasks(newState);
            return;
        }
    
        // Moving between columns
        const startTaskIds = Array.from(startColumn);
        const [movedTask] = startTaskIds.splice(source.index, 1);
    
        const finishTaskIds = Array.from(finishColumn);
        finishTaskIds.splice(destination.index, 0, {
            ...movedTask,
            status: columnTitle[destination.droppableId], // Update status based on column
        });
    
        // Update the tasks state
        const newState = {
            ...tasks,
            [source.droppableId]: startTaskIds,
            [destination.droppableId]: finishTaskIds,
        };
        console.log("newTask-->", newState)
        setTasks(newState);

        
        console.log("old-work-board-->",selectedWorkBoard)


        let newBoard={...selectedWorkBoard}
        newBoard.tasks=[]

        if(newState['completed'].length>0){
            newState['completed'].forEach(task =>{
                newBoard.tasks.push(task)
            })
            
            
            // newBoard.tasks={...newState['completed'].tasks}
        }

        if(newState['in-progress'].length>0){
            newState['in-progress'].forEach(task =>{
                newBoard.tasks.push(task)
            })
        }

        if(newState['to-do'].length>0){
            newState['to-do'].forEach(task =>{
                newBoard.tasks.push(task)
            })
        }
        
        console.log("new-work-board-->",newBoard)
        // Prepare data for API call
        const updatedTask = {
            id: movedTask.id,
            status: columnTitle[destination.droppableId], // Updated status
        };
    
        try {
            // Make API call to update the task status
            // await axios.put(API+'app/workboard/'+workBoardId+'/', newBoard,{
            //     headers: {
            //       'Authorization': `Bearer ${token}`,
            //       'Content-Type': 'application/json',
            //     },
            //   });

            await api.put('app/workboard/'+workBoardId+'/', newBoard);
    
            console.log("Task updated successfully");
        } catch (error) {
            console.error("Error updating task:", error);
            // Optionally, you can revert the state change if the update fails
        }
    };


    if (!selectedWorkBoard) {
        return <p>Loading...</p>;
    }

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div>
                <h1 className="text-3xl font-bold p-4">{selectedWorkBoard.title}</h1>
                <div className="flex space-x-4 p-4 bg-gray-100 min-h-screen">
                    {Object.keys(tasks).map((columnId) => (
                        <Column key={columnId} columnId={columnId} tasks={tasks[columnId]} />
                    ))}
                </div>
            </div>
        </DragDropContext>
    );
};

const Column = ({ columnId, tasks }) => {
    const columnTitle = {
        'to-do': 'To-Do',
        'in-progress': 'In Progress',
        'completed': 'Completed',
    };

    const columnStyles = {
        'to-do': 'bg-purple-100',
        'in-progress': 'bg-blue-100',
        'completed': 'bg-green-100',
    };

    return (
        <Droppable droppableId={columnId}>
            {(provided) => (
                <div
                    className={`${columnStyles[columnId]} rounded-lg shadow-md p-4 w-1/3 min-h-screen`} // Ensure column has min height
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                >
                    <h2 className="text-xl font-bold mb-4">{columnTitle[columnId]}</h2>
                    <div className="space-y-4">
                        {tasks.map((task, index) => (
                            <Task key={task.id} task={task} index={index} />
                        ))}
                        {provided.placeholder}
                    </div>
                </div>
            )}
        </Droppable>
    );
};


const Task = ({ task, index }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleEditClick = () => {
        setIsEditing(!isEditing); // Toggle between edit and view modes
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen); // Toggle dropdown visibility
    };

    return (
        <Draggable draggableId={task.id.toString()} index={index}>
            {(provided) => (
                <div
                    className={`relative rounded-md p-4 flex flex-col ${
                        isEditing ? 'bg-gray-300' : 'bg-gray-200'
                    }`} // Change background based on mode
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                >
                    {/* Conditionally render the task based on the editing state */}
                    {isEditing ? (
                        <div className="space-y-4">
                            {/* Stylish close button as "x" in the top-right corner */}
                            <button
                                onClick={handleEditClick}
                                className="absolute top-2 right-2 bg-gradient-to-r from-red-400 via-red-500 to-red-600 text-white font-bold text-xl rounded-full w-8 h-8 flex items-center justify-center shadow-lg hover:bg-gradient-to-l hover:from-red-500 hover:via-red-400 hover:to-red-300"
                            >
                                <span className="text-2xl">&times;</span>
                            </button>
                            <div className="text-lg font-bold text-black border-b border-white pb-2">
                                {task.title}
                            </div>
                            <div className="text-sm font-semibold text-gray-700 border-b border-white pb-2">
                                {task.description}
                            </div>
                            <div className="text-sm text-blue-500 border-b border-white pb-2">
                                {task.assigned_to}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center">
                                {/* Status text */}
                                {task.status}
                                {/* Dropdown button */}
                                <div className="relative ml-2">
                                    <button
                                        onClick={toggleDropdown}
                                        className="bg-gray-200 text-gray-700 px-2 py-1 rounded-md flex items-center hover:bg-gray-300 focus:outline-none"
                                    >
                                        <span className="mr-1">▼</span> {/* Arrow icon */}
                                    </button>
                                    {isDropdownOpen && (
                                        <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-300 rounded-md shadow-lg">
                                            {/* No options */}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex justify-between items-center">
                            {/* Task content aligned to the left */}
                            <div className="flex-1 text-black font-bold">
                                {task.title}
                            </div>

                            {/* Container for the Edit button and user photo */}
                            <div className="flex flex-col items-center ml-4">
                                {/* Edit option as text with bold styling */}
                                <div
                                    onClick={handleEditClick}
                                    className="text-blue-500 font-bold cursor-pointer"
                                >
                                    Edit
                                </div>

                                {/* Display user photo as a circular background with a centered initial */}
                                <div className="w-10 h-10 bg-blue-200 rounded-full flex justify-center items-center mt-2">
                                    <span className="text-white font-bold text-lg">
                                        {task.assigned_to && task.assigned_to.charAt(0)} {/* Display first letter of assigned_to */}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </Draggable>
    );
};


export default MyWorkboards;






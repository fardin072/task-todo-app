import React, { useState, useEffect } from "react";
import { Button, TextField, List, ListItem, ListItemText, IconButton, MenuItem, Select, FormControl, Checkbox } from "@mui/material";
import { Delete } from "@mui/icons-material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Stopwatch from "./Stopwatch";
import Countdown from "./Countdown";

// toast.configure(); // Initialize toast notifications

const Home = () => {
    const [tasks, setTasks] = useState([]);
    const [task, setTask] = useState("");
    const [description, setDescription] = useState("");
    const [deadline, setDeadline] = useState("");
    const [priority, setPriority] = useState("Medium");
    const [searchQuery, setSearchQuery] = useState("");
    const [filterPriority, setFilterPriority] = useState("");
    const [sortBy, setSortBy] = useState("");

    // Fetch tasks from API
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await fetch("http://127.0.0.1:8000/todos");
                if (!response.ok) throw new Error("Failed to fetch tasks");
                const data = await response.json();
                setTasks(data);
            } catch (error) {
                console.error("Error fetching tasks:", error);
            }
        };

        fetchTasks();
    }, []);

    // Add task
    const addTask = async () => {
        if (task.trim() === "" || deadline === "") return;

        const newTask = {
            title: task,
            description: description || "No description",
            createdAt: new Date(),
            deadline: new Date(deadline),
            priority,
            is_completed: false,
        };

        try {
            const response = await fetch("http://127.0.0.1:8000/todos", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newTask),
            });

            if (!response.ok) throw new Error("Error adding task");

            const data = await response.json();
            setTasks((prevTasks) => [...prevTasks, data]);
            setTask("");
            setDescription("");
            setDeadline("");
            setPriority("Medium");

            // Show success toast
            toast.success("Task added successfully!", { position: "top-right", autoClose: 3000 });

        } catch (error) {
            console.error("Error adding task:", error);
            toast.error("Failed to add task!", { position: "top-right", autoClose: 3000 });
        }
    };

    // Toggle task completion
    const toggleTask = async (id) => {
        const taskToUpdate = tasks.find((task) => task.id === id);
        if (!taskToUpdate) return;

        const updatedTask = { ...taskToUpdate, is_completed: !taskToUpdate.is_completed };

        try {
            const response = await fetch(`http://127.0.0.1:8000/todos/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedTask),
            });
            if (!response.ok) throw new Error("Error updating task completion");
            const data = await response.json();
            setTasks((prevTasks) =>
                prevTasks.map((task) => (task.id === id ? data : task))
            );
        } catch (error) {
            console.error("Error toggling task completion:", error);
        }
    };

    // Delete task
    const deleteTask = async (id) => {
        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));

        try {
            const response = await fetch(`http://127.0.0.1:8000/todos/${id}`, {
                method: "DELETE",
            });
            if (!response.ok) throw new Error("Error deleting task");
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    };

    // Filtering Tasks
    const filteredTasks = tasks
        .filter(
            (task) =>
                task.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
                (filterPriority ? task.priority === filterPriority : true)
        )
        .sort((a, b) => {
            if (sortBy === "creation") return new Date(a.createdAt) - new Date(b.createdAt);
            if (sortBy === "deadline") return new Date(a.deadline) - new Date(b.deadline);
            if (sortBy === "priority") {
                const priorityOrder = { High: 1, Medium: 2, Low: 3 };
                return priorityOrder[a.priority] - priorityOrder[b.priority];
            }
            return 0;
        });

    return (
        <div className="max-w-lg mx-auto mt-10 p-6 bg-gray-100 rounded-lg shadow-md">
            <ToastContainer></ToastContainer>
            <h1 className="text-2xl font-bold text-center mb-4">Todo App</h1>

            <Stopwatch />

            {/* Task Input */}
            <div className="flex flex-col gap-3 mb-4">
                <TextField
                    fullWidth
                    label="Add a task"
                    variant="outlined"
                    value={task}
                    onChange={(e) => setTask(e.target.value)}
                />
                <TextField
                    fullWidth
                    label="Description"
                    variant="outlined"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <TextField
                    fullWidth
                    type="datetime-local"
                    label="Deadline"
                    variant="outlined"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                />
                <FormControl fullWidth>
                    <Select value={priority} onChange={(e) => setPriority(e.target.value)}>
                        <MenuItem value="High">High Priority</MenuItem>
                        <MenuItem value="Medium">Medium Priority</MenuItem>
                        <MenuItem value="Low">Low Priority</MenuItem>
                    </Select>
                </FormControl>
                <Button variant="contained" color="primary" onClick={addTask}>
                    Add Task
                </Button>
            </div>

            {/* Search and Filters */}
            <div className="mb-4 flex flex-col gap-3">
                <TextField
                    fullWidth
                    label="Search Task"
                    variant="outlined"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <FormControl fullWidth>
                    <Select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}>
                        <MenuItem value="">All</MenuItem>
                        <MenuItem value="High">High Priority</MenuItem>
                        <MenuItem value="Medium">Medium Priority</MenuItem>
                        <MenuItem value="Low">Low Priority</MenuItem>
                    </Select>
                </FormControl>
                <FormControl fullWidth>
                    <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                        <MenuItem value="">None</MenuItem>
                        <MenuItem value="creation">Creation Time</MenuItem>
                        <MenuItem value="deadline">Deadline</MenuItem>
                        <MenuItem value="priority">Priority</MenuItem>
                    </Select>
                </FormControl>
            </div>

            {/* Task List */}
            <List>
                {filteredTasks.map(({ id, title, description, createdAt, deadline, priority, is_completed }) => (
                    <ListItem key={id} className={`flex flex-col items-center text-left p-3 rounded-lg shadow-sm mb-2 ${is_completed ? "bg-green-200" : "bg-white"}`}>
                        <ListItemText
                            primary={<span className="text-2xl">{title}</span>}
                            secondary={
                                <>
                                    <div>📅 Created: {new Date(createdAt).toLocaleString()}</div>
                                    <div>⏳ Deadline: {new Date(deadline).toLocaleString()}</div>
                                    <div className={`font-semibold ${priority === "High" ? "text-red-500" : priority === "Medium" ? "text-yellow-500" : "text-green-500"}`}>
                                        ⚡ Priority: {priority}
                                    </div>
                                    <div>{description}</div>
                                </>
                            }
                        />
                        {!is_completed && <Countdown deadline={deadline} />}
                        <div>
                            <Checkbox checked={is_completed} onChange={() => toggleTask(id)} color="success" />
                            <IconButton color="error" onClick={() => deleteTask(id)}>
                                <Delete />
                            </IconButton>
                        </div>
                    </ListItem>
                ))}
            </List>
        </div>
    );
};

export default Home;

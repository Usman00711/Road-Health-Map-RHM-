import React, { useState } from 'react';
import {
  TextField,
  List,
  ListItem,
  ListItemText,
  Button,
} from '@material-ui/core';

const TodoList = () => {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);

  const handleChange = (event) => {
    setTask(event.target.value);
  };

  const handleAddTask = () => {
    setTasks([...tasks, task]);
    setTask('');
  };

  return (
    <div style={{paddingTop:'20px', paddingLeft:'20px'}}>
      <TextField
        label="Enter task"
        value={task}
        onChange={handleChange}
      />
      <br/>
      <br/>

      <Button onClick={handleAddTask} variant="contained" color="inherit">
        Add
      </Button>
      <List>
        {tasks.map((t, i) => (
          <ListItem key={i}>
            <ListItemText primary={t} />
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default TodoList;

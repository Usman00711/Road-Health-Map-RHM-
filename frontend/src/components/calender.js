import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Container} from '@mui/material';

const TaskCalendar = () => {
  const [date, setDate] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  const handleDateChange = (newDate) => {
    setDate(newDate);
  };

  const filteredTasks = tasks.filter((task) => {
    return (
      task.date.getDate() === date.getDate() &&
      task.date.getMonth() === date.getMonth() &&
      task.date.getFullYear() === date.getFullYear()
    );
  });

  return (
    <Container style={{paddingTop:'30px', paddingLeft:'800px'}}>
      <Calendar value={date} onChange={handleDateChange} />
      <h2>Tasks for {date.toLocaleDateString()}</h2>
      {filteredTasks.map((task, index) => (
        <div key={index}>
          <p>{task.task}</p>
        </div>
      ))}
    </Container>
  );
}

export default TaskCalendar;


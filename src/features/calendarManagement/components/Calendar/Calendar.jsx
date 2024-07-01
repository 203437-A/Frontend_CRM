import React, { useEffect, useState } from 'react';
import axios from 'axios';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import styles from './calendar.module.css'; 

const Calendar = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchProjectsAndTasks = async () => {
      try {
       
        const projectsResponse = await axios.get('/projects/');
        const projects = projectsResponse.data;

       
        const tasksResponse = await axios.get('/tasks/');
        const tasks = tasksResponse.data;

        
        const projectEvents = projects.map(project => ({
          title: project.name,
          start: new Date(project.start_date).toISOString(),
          end: new Date(project.finished_date).toISOString(),
        }));

        const taskEvents = tasks.map(task => ({
          title: task.name,
          start: new Date(task.start_date).toISOString(),
          end: new Date(task.finished_date).toISOString(),
        }));

        setEvents([...projectEvents, ...taskEvents]);
      } catch (error) {
        console.error('There was an error fetching the projects and tasks!', error);
      }
    };

    fetchProjectsAndTasks();
  }, []);

  return (
    <div className="home">
      <h2 className='title-container'>Calendario de Proyectos y Tareas</h2>
      <div className={styles.calendarContainer}>
        <FullCalendar
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          events={events}
          
        />
      </div>
    </div>
  );
};

export default Calendar;

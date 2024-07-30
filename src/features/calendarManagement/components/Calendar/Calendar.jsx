import React, { useEffect, useState } from 'react';
import axios from 'axios';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

const Calendar = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchProjectsAndTasks = async () => {
      try {
        const projectsResponse = await axios.get('/projects/');
        const projects = projectsResponse.data;

        const tasksResponse = await axios.get('/tasks/');
        const tasks = tasksResponse.data;

        const projectColors = {};
        const colors = ['#381D2A', '#3E6990', '#AABD8C', '#972D07', '#FFB20F','#1E2D24', '#A77E58', '#000000', '#F71735', '#5F00BA'];
        projects.forEach((project, index) => {
          projectColors[project.id] = colors[index % colors.length];
        });

        const projectEvents = projects.map(project => ({
          title: `Proyecto: ${project.name}`,
          start: new Date(project.start_date).toISOString(),
          end: new Date(project.finished_date).toISOString(),
          backgroundColor: projectColors[project.id],
          borderColor: projectColors[project.id],
          extendedProps: {
            type: 'project'
          }
        }));

        const taskEvents = tasks.map(task => {
          const projectColor = projectColors[task.project];
          return {
            title: `Tarea: ${task.name} (Proyecto: ${task.project_name})`,
            start: new Date(task.start_date).toISOString(),
            end: new Date(task.finished_date).toISOString(),
            backgroundColor: projectColor,
            borderColor: projectColor,
            extendedProps: {
              projectName: task.project_name,
              type: 'task'
            }
          };
        });

        setEvents([...projectEvents, ...taskEvents]);
      } catch (error) {
        console.error('Error fetching the projects and tasks:', error);
      }
    };

    fetchProjectsAndTasks();
  }, []);

  return (
    <div className="home p-5">
      <h2 className="text-center text-2xl font-bold text-white bg-gray-900 rounded-lg p-5 mb-5">
        Calendario de Proyectos y Tareas
      </h2>
      <div className="bg-white p-5 rounded-lg shadow-md">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={events}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,dayGridWeek'
          }}
          buttonText={{
            today: 'Hoy',
            month: 'Mes',
            week: 'Semana'
          }}
          locale="es"
          height="auto"
          eventContent={renderEventContent}
        />
      </div>
    </div>
  );
};

function renderEventContent(eventInfo) {
  return (
    <>
      <b>{eventInfo.timeText}</b>
      <i>{eventInfo.event.title}</i>
      {eventInfo.event.extendedProps.type === 'task' && (
        <div className="mt-1 text-xs text-black">
          <p>Proyecto: {eventInfo.event.extendedProps.projectName}</p>
        </div>
      )}
    </>
  );
}

export default Calendar;

import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import axios from 'axios';
import '../styles/schedule.css';

const localizer = momentLocalizer(moment);

const Schedule = () => {
    const [events, setEvents] = useState([]);
    const [classrooms, setClassrooms] = useState([]); // Inicialización correcta
    const [selectedClassroom, setSelectedClassroom] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const fetchClassrooms = async () => {
        try {
            const response = await axios.get('http://localhost:5000/options');
            if (Array.isArray(response.data)) {
                setClassrooms(response.data); // Verifica que sea un arreglo antes de asignar
            } else {
                console.error('Respuesta inesperada para las aulas:', response.data);
            }
        } catch (error) {
            console.error('Error al cargar aulas:', error);
        }
    };

    const fetchSchedule = async () => {
        if (!selectedClassroom) {
            alert('Por favor selecciona un aula.');
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.get(`http://localhost:5000/schedule?classroom=${selectedClassroom}`);
            const formattedEvents = response.data.map((event) => ({
                title: `${event.tutor} - ${event.subject}`,
                start: new Date(event.start_time),
                end: new Date(event.end_time),
            }));
            setEvents(formattedEvents);
        } catch (error) {
            console.error('Error al obtener el horario:', error);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchClassrooms(); // Cargar las aulas al inicio
    }, []);

    return (
        <div className="schedule-page">
            <h2 className="schedule-title">Horario del Tutor</h2>
            <div className="actions-container">
                <select
                    onChange={(e) => setSelectedClassroom(e.target.value)}
                    value={selectedClassroom}
                    className="select-classroom"
                >
                    <option value="">Selecciona un aula</option>
                    {classrooms.map((classroom) => (
                        <option key={classroom} value={classroom}>
                            {classroom}
                        </option>
                    ))}
                </select>
                <button onClick={fetchSchedule} className="btn-refresh">
                    {isLoading ? 'Cargando...' : 'Actualizar'}
                </button>
            </div>
            <div className="calendar-container">
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: 500, backgroundColor: '#f9f9f9', borderRadius: '8px', padding: '10px' }}
                    messages={{
                        next: 'Sig.',
                        previous: 'Ant.',
                        today: 'Hoy',
                        month: 'Mes',
                        week: 'Semana',
                        day: 'Día',
                        agenda: 'Agenda',
                    }}
                    eventPropGetter={() => ({
                        style: {
                            backgroundColor: '#4b0e8a',
                            color: '#fff',
                            borderRadius: '5px',
                            padding: '5px',
                        },
                    })}
                />
            </div>
        </div>
    );
};

export default Schedule;

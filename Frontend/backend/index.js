const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const session = require('express-session');

const app = express();
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));
app.use(express.json());

app.use(session({
    secret: 'mi-secreto',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false, 
        sameSite: 'lax',
    },
}));


// Configuración de la conexión a MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'zhari',
    database: 'flake_db',
});

db.connect((err) => {
    if (err) {
        console.error('Error conectando a la base de datos:', err);
        return;
    }
    console.log('Conectado a la base de datos MySQL');
});

// ----------------------------- RUTAS -----------------------------

// Ruta de login
app.post('/login', (req, res) => {
    const { username, password, role } = req.body;

    const query = 'SELECT username, full_name, role FROM users WHERE username = ? AND password = ? AND role = ?';
    db.query(query, [username, password, role], (err, results) => {
        if (err) {
            console.error('Error en el servidor:', err);
            return res.status(500).json({ error: 'Error en el servidor' });
        }

        if (results.length > 0) {
            const user = results[0];
            console.log('Usuario encontrado:', user);  // <-- Verifica que `full_name` y `username` estén presentes
            req.session.user = user; // Almacena el usuario en la sesión
            res.json({ success: true, user }); // Enviar `full_name` y `username` en la respuesta
        } else {
            res.json({ success: false, message: 'Credenciales incorrectas' });
        }
    });
});


app.get('/user-info', (req, res) => {
    if (!req.session || !req.session.user) {
        return res.status(401).json({ error: 'No autorizado' });
    }

    const { username, role } = req.session.user; // Directamente extraer username y role
    res.json({ username, role });
});


// Ruta para obtener las opciones de los dropdowns
app.get('/options', async (req, res) => {
    const queries = {
        classrooms: 'SELECT DISTINCT classroom FROM students',
        grades: 'SELECT DISTINCT grade FROM students',
        institutions: 'SELECT DISTINCT institution FROM students',
        schedules: 'SELECT DISTINCT schedule FROM students',
    };

    try {
        const results = await Promise.all(
            Object.entries(queries).map(async ([key, query]) => {
                const [rows] = await db.promise().query(query);
                return [key, rows.map(row => Object.values(row)[0])];
            })
        );

        const options = Object.fromEntries(results);
        res.json(options);
    } catch (err) {
        console.error('Error al obtener opciones:', err);
        res.status(500).json({ error: 'Error al obtener opciones' });
    }
});

// Ruta para obtener estudiantes filtrados
app.get('/students', (req, res) => {
    const { classroom, grade, institution, schedule, date } = req.query;

    if (!classroom || !grade || !institution || !schedule || !date) {
        return res.status(400).json({ error: 'Faltan parámetros para filtrar estudiantes' });
    }

    const query = `
        SELECT *
        FROM students s
        LEFT JOIN attendance a ON s.id = a.student_id
        WHERE s.classroom = ? AND s.grade = ? AND s.institution = ?
          AND a.time = ? AND a.date = ?
    `;

    db.query(query, [classroom, grade, institution, schedule, date], (err, results) => {
        if (err) {
            console.error('Error en la consulta de estudiantes:', err);
            res.status(500).json({ error: 'Error al obtener estudiantes' });
        } else {
            res.json(results);
        }
    });
});

// Ruta para actualizar asistencia
app.post('/update-attendance', (req, res) => {
    const { studentIds, date, schedule, status } = req.body;

    console.log('Datos recibidos para asistencia:', { studentIds, date, schedule, status });

    if (!studentIds || studentIds.length === 0) {
        return res.status(400).json({ error: 'No se seleccionaron estudiantes' });
    }

    const query = `
        UPDATE attendance
        SET status = ?
        WHERE student_id IN (?) AND date = ? AND time = ?
    `;

    db.query(query, [status, studentIds, date, schedule], (err, result) => {
        if (err) {
            console.error('Error en la consulta:', query, err);
            return res.status(500).json({ error: 'Error al actualizar asistencia' });
        }
        console.log('Resultado de la consulta:', result);
        res.json({ success: true, message: 'Asistencia actualizada exitosamente' });
    });
});

// Ruta para agregar estudiantes
app.post('/add-students', (req, res) => {
    const { students, grade, institution, classroom, schedule } = req.body;

    if (!students || students.length === 0) {
        return res.status(400).json({ error: 'No se proporcionaron estudiantes' });
    }

    const values = students.map((student) => [
        student.fullName,
        student.phoneNumber,
        student.email,
        grade,
        institution,
        classroom,
        schedule,
    ]);

    const query = `
        INSERT INTO students (full_name, phone_number, email, grade, institution, classroom, schedule)
        VALUES ?
    `;

    db.query(query, [values], (err) => {
        if (err) {
            console.error('Error al agregar estudiantes:', err);
            res.status(500).json({ error: 'Error al agregar estudiantes' });
        } else {
            res.json({ success: true, message: 'Estudiantes agregados exitosamente' });
        }
    });
});

// Ruta para actualizar las notas de los estudiantes
app.post('/update-grades', (req, res) => {
    const { grades, date, schedule } = req.body;

    if (!grades || grades.length === 0) {
        return res.status(400).json({ error: 'No se proporcionaron notas para actualizar' });
    }

    // Validar que todas las notas estén dentro del rango permitido
    const invalidGrades = grades.filter(g => g.grade < 0 || g.grade > 5);
    if (invalidGrades.length > 0) {
        return res.status(400).json({ error: 'Algunas notas están fuera del rango permitido (0-5)' });
    }

    const query = `
        INSERT INTO grades (student_id, date, time, grade)
        VALUES ? 
        ON DUPLICATE KEY UPDATE grade = VALUES(grade)
    `;

    const values = grades.map(g => [g.id, date, schedule, g.grade]);

    db.query(query, [values], (err, result) => {
        if (err) {
            console.error('Error al actualizar notas:', err);
            res.status(500).json({ error: 'Error al actualizar notas' });
        } else {
            res.json({ success: true, message: 'Notas actualizadas exitosamente' });
        }
    });
});

// Ruta para obtener las aulas disponibles
app.get('/classrooms', (req, res) => {
    const query = 'SELECT DISTINCT classroom FROM schedules'; // Cambiar a la tabla `schedules`

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener aulas:', err);
            return res.status(500).json({ error: 'Error al obtener aulas' });
        }
        // Devuelve solo las aulas como un array simple
        const classrooms = results.map(row => row.classroom);
        res.json(classrooms);
    });
});

// Ruta para obtener horarios filtrados por aula
app.get('/schedule', (req, res) => {
    const { classroom } = req.query;

    if (!classroom) {
        return res.status(400).json({ error: 'El aula es requerida.' });
    }

    const query = `
        SELECT tutor, subject, start_time, end_time 
        FROM schedules 
        WHERE classroom = ?
    `;

    db.query(query, [classroom], (err, results) => {
        if (err) {
            console.error('Error al obtener el horario:', err);
            res.status(500).json({ error: 'Error al obtener el horario' });
        } else {
            const formattedResults = results.map((row) => ({
                tutor: row.tutor,
                subject: row.subject,
                start_time: row.start_time,
                end_time: row.end_time,
            }));
            res.json(formattedResults); 
        }
    });
});

// Ruta para obtener las aulas
app.get('/aulas', (req, res) => {
    const query = 'SELECT * FROM Aulas'; 
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener las aulas:', err);
            res.status(500).json({ error: 'Error al obtener aulas' });
        } else {
            res.json(results);
        }
    });
});

// ----------------------------- RUTAS DE PERSONAL -----------------------------

// Obtener todos los usuarios
app.get('/personal', (req, res) => {
    db.query('SELECT * FROM users', (err, results) => {
        if (err) {
            console.error('Error al obtener usuarios:', err);
            return res.status(500).json({ error: 'Error al obtener usuarios' });
        }
        res.json(results);
    });
});

// Agregar un nuevo usuario
app.post('/personal', (req, res) => {
    const { username, password, full_name, role, email } = req.body;

    if (role === 'admin') {
        // Verificar si ya existe un administrador
        db.query('SELECT COUNT(*) AS adminCount FROM users WHERE role = "admin"', (err, results) => {
            if (err) {
                console.error('Error en la consulta:', err);
                return res.status(500).json({ error: 'Error en la consulta' });
            }

            if (results[0].adminCount > 0) {
                return res.status(400).json({ message: 'Solo puede haber un administrador' });
            }

            // Agregar nuevo administrador
            const query = 'INSERT INTO users (username, password, full_name, role, email) VALUES (?, ?, ?, ?, ?)';
            db.query(query, [username, password, full_name, role, email], (err) => {
                if (err) {
                    console.error('Error al agregar usuario:', err);
                    return res.status(500).json({ error: 'Error al agregar usuario' });
                }
                res.json({ success: true, message: 'Usuario agregado exitosamente' });
            });
        });
    } else {
        // Agregar un instructor
        const query = 'INSERT INTO users (username, password, full_name, role, email) VALUES (?, ?, ?, ?, ?)';
        db.query(query, [username, password, full_name, role, email], (err) => {
            if (err) {
                console.error('Error al agregar usuario:', err);
                return res.status(500).json({ error: 'Error al agregar usuario' });
            }
            res.json({ success: true, message: 'Usuario agregado exitosamente' });
        });
    }
});

// Editar un usuario existente
app.put('/personal/:id', (req, res) => {
    const { id } = req.params;
    const { username, password, full_name, role, email } = req.body;

    db.query(
        'UPDATE users SET username = ?, password = ?, full_name = ?, role = ?, email = ? WHERE id = ?',
        [username, password, full_name, role, email, id],
        (err) => {
            if (err) {
                console.error('Error al actualizar usuario:', err);
                return res.status(500).json({ error: 'Error al actualizar usuario' });
            }
            res.json({ success: true, message: 'Usuario actualizado exitosamente' });
        }
    );
});

// Eliminar un usuario (excepto el administrador)
app.delete('/personal/:id', (req, res) => {
    const { id } = req.params;

    // Verificar si el usuario es administrador
    db.query('SELECT role FROM users WHERE id = ?', [id], (err, results) => {
        if (err) {
            console.error('Error en la consulta:', err);
            return res.status(500).json({ error: 'Error en la consulta' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        if (results[0]?.role === 'admin') {
            return res.status(400).json({ message: 'El administrador no se puede eliminar' });
        }

        // Flujo de eliminación en cascada
        const cascadeQueries = [
            // Eliminar asistencia asociada a estudiantes del usuario
            `DELETE a FROM attendance a
             JOIN students s ON a.student_id = s.id
             WHERE s.user_id = ?`,

            // Eliminar calificaciones asociadas a estudiantes del usuario
            `DELETE g FROM grades g
             JOIN students s ON g.student_id = s.id
             WHERE s.user_id = ?`,

            // Eliminar estudiantes relacionados con aulas del usuario
            `DELETE s FROM students s
             JOIN Aulas a ON s.classroom = a.id_aula
             WHERE a.user_id = ?`,

            // Eliminar aulas asociadas al usuario
            `DELETE FROM Aulas WHERE user_id = ?`,

            // Finalmente, eliminar el usuario
            `DELETE FROM users WHERE id = ?`
        ];

        const executeCascades = cascadeQueries.map(query => {
            return new Promise((resolve, reject) => {
                db.query(query, [id], (err) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve();
                });
            });
        });

        Promise.all(executeCascades)
            .then(() => {
                res.json({ success: true, message: 'Usuario y dependencias eliminados exitosamente.' });
            })
            .catch(err => {
                console.error('Error durante la eliminación en cascada:', err);
                res.status(500).json({ error: 'Error durante la eliminación en cascada' });
            });
    });
});

// ----------------------------- RUTAS DE ESTUDIANTES -----------------------------

// ----------------------------- RUTAS DE ESTUDIANTES -----------------------------

// Obtener todos los estudiantes
app.get("/estudiantes", (req, res) => {
    const query = "SELECT * FROM students";
    db.query(query, (err, results) => {
      if (err) {
        console.error("Error al obtener estudiantes:", err);
        return res.status(500).json({ error: "Error al obtener estudiantes" });
      }
      res.json(results);
    });
  });
  
  // Agregar un nuevo estudiante
  app.post("/estudiantes", (req, res) => {
    const { full_name, phone_number, email, grade, institution, classroom, schedule } = req.body;
  
    const query = `
      INSERT INTO students (full_name, phone_number, email, grade, institution, classroom, schedule)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
  
    db.query(
      query,
      [full_name, phone_number, email, grade, institution, classroom, schedule],
      (err) => {
        if (err) {
          console.error("Error al agregar estudiante:", err);
          return res.status(500).json({ error: "Error al agregar estudiante" });
        }
        res.json({ success: true, message: "Estudiante agregado exitosamente" });
      }
    );
  });
  
  // Actualizar un estudiante existente
  app.put("/estudiantes/:id", (req, res) => {
    const { id } = req.params;
    const { full_name, phone_number, email, grade, institution, classroom, schedule } = req.body;
  
    const query = `
      UPDATE students
      SET full_name = ?, phone_number = ?, email = ?, grade = ?, institution = ?, classroom = ?, schedule = ?
      WHERE id = ?
    `;
  
    db.query(
      query,
      [full_name, phone_number, email, grade, institution, classroom, schedule, id],
      (err) => {
        if (err) {
          console.error("Error al actualizar estudiante:", err);
          return res.status(500).json({ error: "Error al actualizar estudiante" });
        }
        res.json({ success: true, message: "Estudiante actualizado exitosamente" });
      }
    );
  });
  
  // Eliminar un estudiante
  app.delete("/estudiantes/:id", (req, res) => {
    const { id } = req.params;
  
    const query = "DELETE FROM students WHERE id = ?";
    db.query(query, [id], (err) => {
      if (err) {
        console.error("Error al eliminar estudiante:", err);
        return res.status(500).json({ error: "Error al eliminar estudiante" });
      }
      res.json({ success: true, message: "Estudiante eliminado exitosamente" });
    });
  });

  // ----------------------------- RUTAS DE INSTITUCIONES -----------------------------

// Obtener todas las instituciones
// Ruta para obtener todas las instituciones
app.get('/instituciones', (req, res) => {
    const query = `
        SELECT 
            cod_DANE AS cod_DANE, 
            numero AS numero, 
            localidad AS localidad, 
            nombre AS nombre, 
            nombre_rector AS nombre_rector, 
            direccion AS direccion, 
            barrio AS barrio
        FROM Instituciones
    `;
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener instituciones:', err);
            return res.status(500).json({ error: 'Error al obtener instituciones' });
        }
        res.json(results);
    });
});

// Agregar una nueva institución
app.post("/instituciones", (req, res) => {
    const { cod_DANE, numero, localidad, nombre, nombre_rector, direccion, barrio } = req.body;

    const query = `
        INSERT INTO Instituciones (cod_DANE, numero, localidad, nombre, nombre_rector, direccion, barrio)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(query, [cod_DANE, numero, localidad, nombre, nombre_rector, direccion, barrio], (err) => {
        if (err) {
            console.error("Error al agregar institución:", err);
            return res.status(500).json({ error: "Error al agregar institución" });
        }
        res.json({ success: true, message: "Institución agregada exitosamente" });
    });
});

// Editar una institución existente
app.put("/instituciones/:id", (req, res) => {
    const { id } = req.params;
    const { cod_DANE, numero, localidad, nombre, nombre_rector, direccion, barrio } = req.body;

    const query = `
        UPDATE Instituciones
        SET cod_DANE = ?, numero = ?, localidad = ?, nombre = ?, nombre_rector = ?, direccion = ?, barrio = ?
        WHERE cod_DANE = ?
    `;

    db.query(query, [cod_DANE, numero, localidad, nombre, nombre_rector, direccion, barrio, id], (err) => {
        if (err) {
            console.error("Error al actualizar institución:", err);
            return res.status(500).json({ error: "Error al actualizar institución" });
        }
        res.json({ success: true, message: "Institución actualizada exitosamente" });
    });
});

// Eliminar una institución
app.delete("/instituciones/:id", (req, res) => {
    const { id } = req.params;

    const query = "DELETE FROM Instituciones WHERE cod_DANE = ?";
    db.query(query, [id], (err) => {
        if (err) {
            console.error("Error al eliminar institución:", err);
            return res.status(500).json({ error: "Error al eliminar institución" });
        }
        res.json({ success: true, message: "Institución eliminada exitosamente" });
    });
});

// ----------------------------- RUTAS DE AULAS -----------------------------

// Obtener todas las aulas
app.get('/aulas', (req, res) => {
    const query = `
        SELECT 
            id_aula, 
            grad_text, 
            grad_num, 
            jornada, 
            num_grupo, 
            id_profesor, 
            user_id, 
            institution
        FROM Aulas
    `;
    db.query(query, (err, results) => {
      if (err) {
        console.error('Error al obtener aulas:', err);
        return res.status(500).json({ error: 'Error al obtener aulas' });
      }
      res.json(results);
    });
  });
  
  // Agregar una nueva aula
  app.post('/aulas', (req, res) => {
    const { id_aula, grad_text, grad_num, jornada, num_grupo, id_profesor, user_id, institution } = req.body;
  
    const query = `
        INSERT INTO Aulas (id_aula, grad_text, grad_num, jornada, num_grupo, id_profesor, user_id, institution)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
  
    db.query(
      query,
      [id_aula, grad_text, grad_num, jornada, num_grupo, id_profesor, user_id, institution],
      (err) => {
        if (err) {
          console.error('Error al agregar aula:', err);
          return res.status(500).json({ error: 'Error al agregar aula' });
        }
        res.json({ success: true, message: 'Aula agregada exitosamente' });
      }
    );
  });
  
  // Editar una aula existente
  app.put('/aulas/:id', (req, res) => {
    const { id } = req.params;
    const { id_aula, grad_text, grad_num, jornada, num_grupo, id_profesor, user_id, institution } = req.body;
  
    const query = `
        UPDATE Aulas
        SET id_aula = ?, grad_text = ?, grad_num = ?, jornada = ?, num_grupo = ?, id_profesor = ?, user_id = ?, institution = ?
        WHERE id_aula = ?
    `;
  
    db.query(
      query,
      [id_aula, grad_text, grad_num, jornada, num_grupo, id_profesor, user_id, institution, id],
      (err) => {
        if (err) {
          console.error('Error al actualizar aula:', err);
          return res.status(500).json({ error: 'Error al actualizar aula' });
        }
        res.json({ success: true, message: 'Aula actualizada exitosamente' });
      }
    );
  });
  
  // Eliminar una aula
  app.delete('/aulas/:id', (req, res) => {
    const { id } = req.params;
  
    const query = 'DELETE FROM Aulas WHERE id_aula = ?';
    db.query(query, [id], (err) => {
      if (err) {
        console.error('Error al eliminar aula:', err);
        return res.status(500).json({ error: 'Error al eliminar aula' });
      }
      res.json({ success: true, message: 'Aula eliminada exitosamente' });
    });
  });
  

// ----------------------------- INICIAR SERVIDOR -----------------------------
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

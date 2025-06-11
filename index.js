// backend/index.js
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const db = require('./conexion');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));

// Página principal
app.get('/', (req, res) => {
  db.query('SELECT * FROM tareas', (err, resultados) => {
    if (err) throw err;
    res.render('index', { tareas: resultados });
  });
});

// Ruta para crear tarea
app.post('/crear', (req, res) => {
  const { titulo, descripcion, fecha_limite, prioridad, estado } = req.body;
  db.query(
    'INSERT INTO tareas (titulo, descripcion, fecha_limite, prioridad, estado) VALUES (?, ?, ?, ?, ?)',
    [titulo, descripcion, fecha_limite, prioridad, estado],
    (err) => {
      if (err) throw err;
      res.redirect('/');
    }
  );
});

// Ruta para eliminar tarea
app.get('/eliminar/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM tareas WHERE id = ?', [id], (err) => {
    if (err) throw err;
    res.redirect('/');
  });
});

// Ruta para editar tarea (formulario)
app.get('/editar/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM tareas WHERE id = ?', [id], (err, resultados) => {
    if (err) throw err;
    res.render('editar', { tarea: resultados[0] });
  });
});

// Ruta para actualizar tarea
app.post('/actualizar/:id', (req, res) => {
  const { id } = req.params;
  const { titulo, descripcion, fecha_limite, prioridad, estado } = req.body;
  db.query(
    'UPDATE tareas SET titulo = ?, descripcion = ?, fecha_limite = ?, prioridad = ?, estado = ? WHERE id = ?',
    [titulo, descripcion, fecha_limite, prioridad, estado, id],
    (err) => {
      if (err) throw err;
      res.redirect('/');
    }
  );
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));

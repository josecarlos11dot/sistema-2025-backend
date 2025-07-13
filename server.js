const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Esquema para los registros
const RegistroSchema = new mongoose.Schema({
  placa: String,
  marca: String,
  modelo: String,
  color: String,
  precio: String,
  lavador: String,
  fecha: { type: Date, default: Date.now }
});

const Registro = mongoose.model('Registro', RegistroSchema);

// Ruta para guardar un registro
app.post('/api/registros', async (req, res) => {
  const nuevo = new Registro(req.body);
  await nuevo.save();
  res.json(nuevo);
});


// Ruta para obtener registros
app.get('/api/registros', async (req, res) => {
  const registros = await Registro.find().sort({ fecha: -1 });
  res.json(registros);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
// Ruta para actualizar un registro existente
app.put('/api/registros/:id', async (req, res) => {
  try {
    const actualizado = await Registro.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!actualizado) {
      return res.status(404).json({ error: 'Registro no encontrado' });
    }
    res.json(actualizado);
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar el registro' });
  }
});


  // Ruta para eliminar un registro por ID
app.delete('/api/registros/:id', async (req, res) => {
    try {
      await Registro.findByIdAndDelete(req.params.id);
      res.status(200).json({ mensaje: 'Registro eliminado correctamente' });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar el registro' });
    }
  });

  // Ruta para editar un registro por ID
app.put('/api/registros/:id', async (req, res) => {
    try {
      const actualizado = await Registro.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true } // devuelve el documento actualizado
      );
      res.status(200).json(actualizado);
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar el registro' });
    }
  });

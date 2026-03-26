require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors({
  origin: ['https://autos-frontend-omega.vercel.app', 'http://localhost:5173']
}));

// --- MODELOS ---

const Auto = mongoose.model('Auto', new mongoose.Schema({
    nombre: String, precio: Number, caracteristicas: String,
    imagen: String, km: String, transmision: String,
    color: String, duenos: String, motor: String, año: Number,
}), 'autos');

const Cita = mongoose.model('Cita', new mongoose.Schema({
    autoNombre: String, nombre: String, telefono: String,
    fecha: String, createdAt: { type: Date, default: Date.now }
}), 'citas');

const Usuario = mongoose.model('Usuario', new mongoose.Schema({
    nombre: String, correo: String,
    contrasena: { type: String, default: 'google' },
    foto: String, loginAt: { type: Date, default: Date.now }
}), 'usuarios');

// --- DATOS INICIALES ---

const actualizarInventario = async () => {
    try {
        const count = await Auto.countDocuments();
        if (count > 0) return; // No sobrescribir si ya hay autos
        const autos = [
            { nombre: "Nissan March 2018", año: 2018, precio: 175000, caracteristicas: "Hatchback compacto, excelente para ciudad, bajo consumo de combustible.", km: "52,000 km", transmision: "Manual", color: "Azul", duenos: "1 dueño", motor: "1.6L 4 cilindros", imagen: "https://cdn.imagin.studio/getimage?customer=img&make=nissan&modelFamily=micra&modelYear=2018&paintId=color-blue" },
            { nombre: "VW Jetta 2016", año: 2016, precio: 195000, caracteristicas: "Sedán alemán, confort y tecnología, suspensión independiente.", km: "88,000 km", transmision: "Automático", color: "Gris Plata", duenos: "1 dueño", motor: "2.0L 4 cilindros", imagen: "https://cdn.imagin.studio/getimage?customer=img&make=volkswagen&modelFamily=jetta&modelYear=2016&paintId=color-silver" },
            { nombre: "Honda Fit 2017", año: 2017, precio: 185000, caracteristicas: "Hatchback versátil, asientos Magic Seat, muy espacioso por su tamaño.", km: "61,000 km", transmision: "Automático", color: "Rojo", duenos: "1 dueño", motor: "1.5L 4 cilindros", imagen: "https://cdn.imagin.studio/getimage?customer=img&make=honda&modelFamily=jazz&modelYear=2017&paintId=color-red" },
            { nombre: "Toyota Yaris 2019", año: 2019, precio: 220000, caracteristicas: "Sedán confiable, bajo mantenimiento, ideal para uso diario.", km: "40,000 km", transmision: "Automático", color: "Blanco", duenos: "1 dueño", motor: "1.5L 4 cilindros", imagen: "https://cdn.imagin.studio/getimage?customer=img&make=toyota&modelFamily=yaris&modelYear=2019&paintId=color-white" },
            { nombre: "Dodge Durango 2020", año: 2020, precio: 1134900, caracteristicas: "SUV de lujo, tercera fila de asientos, tracción 4x4.", km: "35,000 km", transmision: "Automático", color: "Negro", duenos: "1 dueño", motor: "3.6L V6", imagen: "https://cdn.imagin.studio/getimage?customer=img&make=dodge&modelFamily=durango&modelYear=2020&paintId=color-black" },
            { nombre: "Chevrolet Aveo 2015", año: 2015, precio: 120000, caracteristicas: "Sedán económico, refacciones accesibles, muy fácil de manejar.", km: "95,000 km", transmision: "Manual", color: "Blanco", duenos: "2 dueños", motor: "1.6L 4 cilindros", imagen: "https://cdn.imagin.studio/getimage?customer=img&make=chevrolet&modelFamily=aveo&modelYear=2015&paintId=color-white" },
            { nombre: "Ford Focus 2016", año: 2016, precio: 168000, caracteristicas: "Hatchback europeo, dirección precisa, excelente manejo.", km: "79,000 km", transmision: "Automático", color: "Azul", duenos: "1 dueño", motor: "2.0L 4 cilindros", imagen: "https://cdn.imagin.studio/getimage?customer=img&make=ford&modelFamily=focus&modelYear=2016&paintId=color-blue" },
            { nombre: "Mazda 3 2018", año: 2018, precio: 245000, caracteristicas: "Sedán deportivo, tecnología SKYACTIV, acabados premium.", km: "58,000 km", transmision: "Automático", color: "Rojo", duenos: "1 dueño", motor: "2.0L 4 cilindros", imagen: "https://cdn.imagin.studio/getimage?customer=img&make=mazda&modelFamily=mazda3&modelYear=2018&paintId=color-red" },
            { nombre: "Hyundai Elantra 2017", año: 2017, precio: 178000, caracteristicas: "Sedán coreano, garantía extendida de fábrica, económico.", km: "70,000 km", transmision: "Automático", color: "Gris", duenos: "1 dueño", motor: "2.0L 4 cilindros", imagen: "https://cdn.imagin.studio/getimage?customer=img&make=hyundai&modelFamily=elantra&modelYear=2017&paintId=color-grey" },
            { nombre: "Kia Rio 2019", año: 2019, precio: 195000, caracteristicas: "Sedán compacto, pantalla touch, cámara de reversa.", km: "44,000 km", transmision: "Automático", color: "Blanco", duenos: "1 dueño", motor: "1.6L 4 cilindros", imagen: "https://cdn.imagin.studio/getimage?customer=img&make=kia&modelFamily=rio&modelYear=2019&paintId=color-white" },
            { nombre: "Seat Ibiza 2017", año: 2017, precio: 162000, caracteristicas: "Hatchback europeo, diseño moderno, bajo consumo.", km: "65,000 km", transmision: "Manual", color: "Negro", duenos: "1 dueño", motor: "1.6L 4 cilindros", imagen: "https://cdn.imagin.studio/getimage?customer=img&make=seat&modelFamily=ibiza&modelYear=2017&paintId=color-black" },
            { nombre: "Honda Civic 2016", año: 2016, precio: 215000, caracteristicas: "Sedán deportivo, motor turbo, sistema Honda Sensing.", km: "82,000 km", transmision: "CVT", color: "Plata", duenos: "1 dueño", motor: "1.5L Turbo", imagen: "https://cdn.imagin.studio/getimage?customer=img&make=honda&modelFamily=civic&modelYear=2016&paintId=color-silver" },
            { nombre: "Toyota Corolla 2018", año: 2018, precio: 255000, caracteristicas: "Sedán clásico, confiabilidad comprobada, bajo costo de mantenimiento.", km: "55,000 km", transmision: "Automático", color: "Blanco", duenos: "1 dueño", motor: "1.8L 4 cilindros", imagen: "https://cdn.imagin.studio/getimage?customer=img&make=toyota&modelFamily=corolla&modelYear=2018&paintId=color-white" },
            { nombre: "Nissan Sentra 2017", año: 2017, precio: 172000, caracteristicas: "Sedán espacioso, pantalla NissanConnect, buena estabilidad.", km: "74,000 km", transmision: "CVT", color: "Gris", duenos: "2 dueños", motor: "1.8L 4 cilindros", imagen: "https://cdn.imagin.studio/getimage?customer=img&make=nissan&modelFamily=sentra&modelYear=2017&paintId=color-grey" },
            { nombre: "VW Golf 2015", año: 2015, precio: 188000, caracteristicas: "Hatchback alemán, suspensión deportiva, calidad de construcción superior.", km: "91,000 km", transmision: "Manual", color: "Negro", duenos: "1 dueño", motor: "2.0L 4 cilindros", imagen: "https://cdn.imagin.studio/getimage?customer=img&make=volkswagen&modelFamily=golf&modelYear=2015&paintId=color-black" },
            { nombre: "Chevrolet Spark 2018", año: 2018, precio: 138000, caracteristicas: "Citadino compacto, fácil estacionamiento, ideal para tráfico.", km: "48,000 km", transmision: "Automático", color: "Rojo", duenos: "1 dueño", motor: "1.4L 4 cilindros", imagen: "https://cdn.imagin.studio/getimage?customer=img&make=chevrolet&modelFamily=spark&modelYear=2018&paintId=color-red" },
            { nombre: "Ford Escape 2016", año: 2016, precio: 268000, caracteristicas: "SUV familiar, tracción 4x4, techo panorámico.", km: "85,000 km", transmision: "Automático", color: "Azul", duenos: "1 dueño", motor: "2.0L Turbo", imagen: "https://cdn.imagin.studio/getimage?customer=img&make=ford&modelFamily=escape&modelYear=2016&paintId=color-blue" },
            { nombre: "Mazda CX-5 2017", año: 2017, precio: 315000, caracteristicas: "SUV premium, i-ACTIV AWD, interior de lujo con piel.", km: "68,000 km", transmision: "Automático", color: "Gris", duenos: "1 dueño", motor: "2.5L 4 cilindros", imagen: "https://cdn.imagin.studio/getimage?customer=img&make=mazda&modelFamily=cx-5&modelYear=2017&paintId=color-grey" },
            { nombre: "Hyundai Tucson 2018", año: 2018, precio: 298000, caracteristicas: "SUV familiar, pantalla de 8 pulgadas, asientos de piel.", km: "60,000 km", transmision: "Automático", color: "Blanco", duenos: "1 dueño", motor: "2.0L 4 cilindros", imagen: "https://cdn.imagin.studio/getimage?customer=img&make=hyundai&modelFamily=tucson&modelYear=2018&paintId=color-white" },
            { nombre: "Kia Sportage 2016", año: 2016, precio: 272000, caracteristicas: "SUV coreano, diseño angular, equipamiento completo de serie.", km: "77,000 km", transmision: "Automático", color: "Negro", duenos: "1 dueño", motor: "2.0L 4 cilindros", imagen: "https://cdn.imagin.studio/getimage?customer=img&make=kia&modelFamily=sportage&modelYear=2016&paintId=color-black" },
        ];
        await Auto.insertMany(autos);
        console.log(`✅ ${autos.length} autos cargados`);
    } catch (error) {
        console.error("❌ Error al cargar autos:", error);
    }
};

// --- RUTAS AUTOS ---

app.get('/api/autos', async (req, res) => {
    try { res.json(await Auto.find()); }
    catch (e) { res.status(500).json({ mensaje: 'Error' }); }
});

app.post('/api/autos', async (req, res) => {
    try {
        const auto = new Auto(req.body);
        await auto.save();
        res.status(201).json({ mensaje: 'Auto agregado', auto });
    } catch (e) { res.status(400).json({ mensaje: 'Error al agregar' }); }
});

app.put('/api/autos/:id', async (req, res) => {
    try {
        const auto = await Auto.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({ mensaje: 'Auto actualizado', auto });
    } catch (e) { res.status(400).json({ mensaje: 'Error al actualizar' }); }
});

app.delete('/api/autos/:id', async (req, res) => {
    try {
        await Auto.findByIdAndDelete(req.params.id);
        res.json({ mensaje: 'Auto eliminado' });
    } catch (e) { res.status(400).json({ mensaje: 'Error al eliminar' }); }
});

// --- RUTAS CITAS ---

app.post('/api/citas', async (req, res) => {
    try {
        const cita = new Cita(req.body);
        await cita.save();
        res.status(201).json({ mensaje: 'Cita agendada exitosamente' });
    } catch (e) { res.status(500).json({ mensaje: 'Error al guardar cita' }); }
});

app.get('/api/citas', async (req, res) => {
    try { res.json(await Cita.find().sort({ createdAt: -1 })); }
    catch (e) { res.status(500).json({ mensaje: 'Error' }); }
});

// --- RUTAS USUARIOS ---

app.post('/api/usuarios', async (req, res) => {
    try {
        const { nombre, correo, foto } = req.body;
        const existente = await Usuario.findOne({ correo });
        if (existente) return res.status(200).json({ mensaje: 'Ya registrado' });
        const u = new Usuario({ nombre, correo, foto });
        await u.save();
        res.status(201).json({ mensaje: 'Usuario registrado' });
    } catch (e) { res.status(500).json({ mensaje: 'Error' }); }
});

app.get('/api/usuarios', async (req, res) => {
    try { res.json(await Usuario.find().sort({ loginAt: -1 })); }
    catch (e) { res.status(500).json({ mensaje: 'Error' }); }
});

// --- CONEXIÓN ---

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("✅ Conectado a Atlas");
        actualizarInventario();
        app.listen(5000, () => console.log('🚀 Servidor en http://localhost:5000'));
    })
    .catch(e => console.error("❌ Error:", e));

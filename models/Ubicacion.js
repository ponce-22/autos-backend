const mongoose = require ('mongoose');

const UbicacionesSchema = new mongoose.Schema({
    usuario: String,
    email: String,
    lat: Number,
    lng: Number,
    fecha: {type: Date, default: Date.now}
});
module.exports= mongoose.model('Ubicacion', UbicacionesSchema);
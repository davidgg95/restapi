"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Productos = exports.Tiendas = void 0;
const mongoose_1 = require("mongoose");
const productoSchema = new mongoose_1.Schema({
    _id: Number,
    _nombre: String,
    _precio: Number,
    _cantidad: Number,
    _entrada: Date,
    _tienda: String
}, {
    collection: 'productos'
});
const tiendaSchema = new mongoose_1.Schema({
    _id: Number,
    _nombre: String,
    _provincia: String,
    _direccion: String,
    _ingresos: Number,
}, {
    collection: 'tiendas'
});
exports.Tiendas = mongoose_1.model('tiendas', tiendaSchema);
exports.Productos = mongoose_1.model('productos', productoSchema);

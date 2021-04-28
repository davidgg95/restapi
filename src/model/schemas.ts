import {Schema, model } from 'mongoose'

const productoSchema = new Schema({
    _id: Number,
    _nombre: String,
    _precio: Number,
    _cantidad: Number,
    _entrada: Date,
    _tienda: String
},
{
    collection:'productos'
})
const tiendaSchema = new Schema({
    _id: Number,
    _nombre: String,
    _provincia: String,
    _direccion: String,
    _ingresos: Number,
},
{
    collection:'tiendas'
})
export const Tiendas = model ('tiendas', tiendaSchema)
export const Productos = model('productos', productoSchema)
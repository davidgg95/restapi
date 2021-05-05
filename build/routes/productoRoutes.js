"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productoRoutes = void 0;
const express_1 = require("express");
const schemas_1 = require("../model/schemas");
const database_1 = require("../database/database");
class ProductoRoutes {
    constructor() {
        this.getProductos = (req, res) => __awaiter(this, void 0, void 0, function* () {
            yield database_1.db.conectarBD()
                .then((mensaje) => __awaiter(this, void 0, void 0, function* () {
                console.log(mensaje);
                const query = yield schemas_1.Productos.find({});
                console.log(query);
                res.json(query);
            }))
                .catch((mensaje) => {
                res.send(mensaje);
                console.log(mensaje);
            });
            yield database_1.db.desconectarBD();
        });
        this.getTiendas = (req, res) => __awaiter(this, void 0, void 0, function* () {
            yield database_1.db.conectarBD()
                .then(() => __awaiter(this, void 0, void 0, function* () {
                const query = yield schemas_1.Tiendas.aggregate([
                    {
                        $lookup: {
                            from: 'productos',
                            localField: '_nombre',
                            foreignField: '_tienda',
                            as: "productos"
                        }
                    }
                ]);
                res.json(query);
            }))
                .catch((mensaje) => {
                res.send(mensaje);
            });
            yield database_1.db.desconectarBD();
        });
        this.getTienda = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { nombre } = req.params;
            yield database_1.db.conectarBD()
                .then(() => __awaiter(this, void 0, void 0, function* () {
                const query = yield schemas_1.Tiendas.aggregate([
                    {
                        $lookup: {
                            from: 'productos',
                            localField: '_nombre',
                            foreignField: '_tienda',
                            as: "productos"
                        }
                    }, {
                        $match: {
                            _nombre: nombre
                        }
                    }
                ]);
                res.json(query);
            }))
                .catch((mensaje) => {
                res.send(mensaje);
            });
            yield database_1.db.desconectarBD();
        });
        this.getProducto = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { nombre } = req.params;
            yield database_1.db.conectarBD();
            const p = yield schemas_1.Productos.find({ _nombre: nombre });
            yield database_1.db.desconectarBD();
            res.json(p);
        });
        this.nuevoProductoPost = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id, nombre, precio, cantidad, entrada, tienda } = req.body;
            yield database_1.db.conectarBD();
            const dSchema = {
                _id: id,
                _nombre: nombre,
                _precio: precio,
                _cantidad: cantidad,
                _entrada: entrada,
                _tienda: tienda
            };
            const oSchema = new schemas_1.Productos(dSchema);
            yield oSchema.save()
                .then((doc) => res.send(doc))
                .catch((err) => res.send('Error: ' + err));
            yield database_1.db.desconectarBD();
        });
        this.nuevoTiendaPost = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id, nombre, provincia, direccion, ingresos } = req.body;
            yield database_1.db.conectarBD();
            const dSchema = {
                _id: id,
                _nombre: nombre,
                _provincia: provincia,
                _direccion: direccion,
                _ingresos: ingresos
            };
            const oSchema = new schemas_1.Tiendas(dSchema);
            yield oSchema.save()
                .then((doc) => res.send(doc))
                .catch((err) => res.send('Error: ' + err));
            yield database_1.db.desconectarBD();
        });
        this.actualizaProducto = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { nombre } = req.params;
            const { precio, cantidad, entrada, tienda } = req.body;
            yield database_1.db.conectarBD();
            yield schemas_1.Productos.findOneAndUpdate({ _nombre: nombre }, {
                _nombre: nombre,
                _precio: precio,
                _cantidad: cantidad,
                _entrada: entrada,
                _tienda: tienda
            }, {
                new: true,
                runValidators: true
            })
                .then((docu) => {
                if (docu == null) {
                    console.log('El producto que desea modificar no existe');
                    res.json({ "Error": "No existe: " + nombre });
                }
                else {
                    console.log('Modificado Correctamente: ' + docu);
                    res.json(docu);
                }
            })
                .catch((err) => {
                console.log('Error: ' + err);
                res.json({ error: 'Error: ' + err });
            });
            yield database_1.db.desconectarBD();
        });
        this.actualizaTienda = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { nombre } = req.params;
            const { provincia, direccion, ingresos } = req.body;
            yield database_1.db.conectarBD();
            yield schemas_1.Tiendas.findOneAndUpdate({ _nombre: nombre }, {
                _nombre: nombre,
                _provincia: provincia,
                _direccion: direccion,
                _ingresos: ingresos
            }, {
                new: true,
                runValidators: true
            })
                .then((docu) => {
                if (docu == null) {
                    console.log('La Tienda que desea modificar no existe');
                    res.json({ "Error": "No existe: " + nombre });
                }
                else {
                    console.log('Modificado Correctamente: ' + docu);
                    res.json(docu);
                }
            })
                .catch((err) => {
                console.log('Error: ' + err);
                res.json({ error: 'Error: ' + err });
            });
            yield database_1.db.desconectarBD();
        });
        this.deleteProducto = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { nombre } = req.params;
            yield database_1.db.conectarBD();
            yield schemas_1.Productos.findOneAndDelete({
                _nombre: nombre
            })
                .then((doc) => {
                if (doc == null) {
                    console.log(`No encontrado`);
                    res.send(`No encontrado`);
                }
                else {
                    console.log('Borrado correcto: ' + doc);
                    res.send('Borrado correcto: ' + doc);
                }
            });
            database_1.db.desconectarBD();
        });
        this.deleteTienda = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { nombre } = req.params;
            yield database_1.db.conectarBD();
            yield schemas_1.Tiendas.findOneAndDelete({
                _nombre: nombre
            })
                .then((doc) => {
                if (doc == null) {
                    console.log(`No encontrado`);
                    res.send(`No encontrado`);
                }
                else {
                    console.log('Borrado correcto: ' + doc);
                    res.send('Borrado correcto: ' + doc);
                }
            });
            database_1.db.desconectarBD();
        });
        this.getProdu = (req, res) => __awaiter(this, void 0, void 0, function* () {
            yield database_1.db.conectarBD()
                .then(() => __awaiter(this, void 0, void 0, function* () {
                const query = yield schemas_1.Productos.aggregate([
                    {
                        $group: {
                            _id: "_tienda", Total_productos: { $sum: "_cantidad" }
                        }
                    }
                ]);
                res.json(query);
            }))
                .catch((mensaje) => {
                res.send(mensaje);
            });
            yield database_1.db.desconectarBD();
        });
        this._router = express_1.Router();
    }
    get router() {
        return this._router;
    }
    misRutas() {
        this._router.get('/', this.getTiendas);
        this._router.get('/producto', this.getProductos);
        this._router.get('/tienda/:nombre', this.getTienda);
        this._router.get('/producto/:nombre', this.getProducto);
        this._router.post('/nuevoProducto', this.nuevoProductoPost);
        this._router.post('/nuevoTienda', this.nuevoTiendaPost);
        this._router.post('/actualizaProducto/:nombre', this.actualizaProducto);
        this._router.post('/actualizaTienda/:nombre', this.actualizaTienda);
        this._router.get('/borrarProducto/:nombre', this.deleteProducto);
        this._router.get('/borrarTienda/:nombre', this.deleteTienda);
        this._router.get('/aggreProdu', this.getProdu);
    }
}
const obj = new ProductoRoutes();
obj.misRutas();
exports.productoRoutes = obj.router;

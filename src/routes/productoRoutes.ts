import {Request, Response, Router } from 'express'
import { Productos, Tiendas } from '../model/schemas'
import { db } from '../database/database'

class ProductoRoutes {
    private _router: Router

    constructor() {
        this._router = Router()
    }
    get router(){
        return this._router
    }

    private getProductos = async (req: Request, res: Response) => {
        await db.conectarBD()
        .then( async (mensaje) => {
            console.log(mensaje)
            const query:any  = await Productos.find({})
            console.log(query)
            res.json(query)
        })
        .catch((mensaje) => {
            res.send(mensaje)
            console.log(mensaje)
        })

        await db.desconectarBD()
    }

    private getTiendas = async (req:Request, res: Response) => {
        await db.conectarBD()
        .then( async ()=> {
            const query = await Tiendas.aggregate([
                {
                    $lookup: {
                        from: 'productos',
                        localField: '_nombre',
                        foreignField: '_tienda',
                        as: "productos"
                    }
                }
            ])
            res.json(query)
        })
        .catch((mensaje) => {
            res.send(mensaje)
        })
        await db.desconectarBD()
    }

    private getTienda = async (req: Request, res: Response) => {
        const { nombre } = req.params
        await db.conectarBD()
        .then( async ()=> {
            const query = await Tiendas.aggregate([
                {
                    $lookup: {
                        from: 'productos',
                        localField: '_nombre',
                        foreignField: '_tienda',
                        as: "productos"
                    }
                },{
                    $match: {
                        _nombre: nombre
                    }
                }
            ])
            res.json(query)
        })
        .catch((mensaje) => {
            res.send(mensaje)
        })
        await db.desconectarBD()
    }

    private getProducto = async (req: Request, res: Response) => {
        const { nombre } = req.params
        await db.conectarBD()
        const p = await Productos.find(
                { _nombre: nombre }
            )
        await db.desconectarBD()
        res.json(p)
    }

    private nuevoProductoPost = async (req: Request, res: Response) => {
        const { id, nombre, precio, cantidad, entrada, tienda } = req.body
        await db.conectarBD()
        const dSchema = {
            _id: id,
            _nombre: nombre,
            _precio: precio,
            _cantidad: cantidad,
            _entrada: entrada,
            _tienda: tienda
        }
        const oSchema = new Productos(dSchema)
        await oSchema.save()
        .then( (doc) => res.send(doc))
        .catch( (err: any) => res.send('Error: ' + err))  
        await db.desconectarBD()
    } 
    
    private nuevoTiendaPost = async (req: Request, res: Response) => {
        const { id, nombre, provincia, direccion, ingresos } = req.body
        await db.conectarBD()
        const dSchema = {
            _id: id,
            _nombre: nombre,
            _provincia: provincia,
            _direccion: direccion,
            _ingresos: ingresos
        }
        const oSchema = new Tiendas(dSchema)
        await oSchema.save()
        .then( (doc) => res.send(doc))
        .catch( (err: any) => res.send('Error: ' + err))  
        await db.desconectarBD()
    } 

    private actualizaProducto = async (req: Request, res: Response) => {
        const { nombre } = req.params
        const {precio, cantidad, entrada, tienda } = req.body
        await db.conectarBD()
        await Productos.findOneAndUpdate(
                { _nombre: nombre }, 
                {
                    _nombre: nombre,
                    _precio: precio,
                    _cantidad: cantidad,
                    _entrada: entrada,
                    _tienda: tienda
                },
                {
                    new: true,
                    runValidators: true 
                }  
            )
            .then( (docu) => {
                    if (docu==null){
                        console.log('El producto que desea modificar no existe')
                        res.json({"Error":"No existe: "+nombre})
                    } else {
                        console.log('Modificado Correctamente: '+ docu) 
                        res.json(docu)
                    }
                    
                }
            )
            .catch( (err) => {
                console.log('Error: '+err)
                res.json({error: 'Error: '+err })
            }
            ) 
        await db.desconectarBD()
    }

    private actualizaTienda = async (req: Request, res: Response) => {
        const { nombre } = req.params
        const {provincia, direccion, ingresos } = req.body
        await db.conectarBD()
        await Tiendas.findOneAndUpdate(
                { _nombre: nombre }, 
                {
                    _nombre: nombre,
                    _provincia: provincia,
                    _direccion: direccion,
                    _ingresos: ingresos
                },
                {
                    new: true,
                    runValidators: true 
                }  
            )
            .then( (docu) => {
                    if (docu==null){
                        console.log('La Tienda que desea modificar no existe')
                        res.json({"Error":"No existe: "+nombre})
                    } else {
                        console.log('Modificado Correctamente: '+ docu) 
                        res.json(docu)
                    }
                    
                }
            )
            .catch( (err) => {
                console.log('Error: '+err)
                res.json({error: 'Error: '+err })
            }
            ) 
        await db.desconectarBD()
    }

    private deleteProducto = async (req: Request, res: Response) => {
        const { nombre } = req.params
        await db.conectarBD()
        await Productos.findOneAndDelete(
            { 
                _nombre: nombre
            })
            .then( (doc) => {
                if (doc==null){
                    console.log(`No encontrado`)
                    res.send(`No encontrado`)
                } else {
                    console.log('Borrado correcto: '+ doc)
                    res.send('Borrado correcto: '+ doc)
                }
                
            }
        )
        
        db.desconectarBD()
    }

    private deleteTienda= async (req: Request, res: Response) => {
        const { nombre } = req.params
        await db.conectarBD()
        await Tiendas.findOneAndDelete(
            { 
                _nombre: nombre
            })
            .then( (doc) => {
                if (doc==null){
                    console.log(`No encontrado`)
                    res.send(`No encontrado`)
                } else {
                    console.log('Borrado correcto: '+ doc)
                    res.send('Borrado correcto: '+ doc)
                }
                
            }
        )
        
        db.desconectarBD()
    }

    private getProdu = async (req:Request, res: Response) => {
        await db.conectarBD()
        .then( async ()=> {
            const query = await Productos.aggregate([
            {
                $group: {
                    _id:"_tienda", Total_productos:{$sum: "_cantidad"}
                }
            }
            ])
            res.json(query)
        })
        .catch((mensaje) => {
            res.send(mensaje)
        })
        await db.desconectarBD()
    }


    misRutas(){
        this._router.get('/', this.getTiendas)
        this._router.get('/producto', this.getProductos)
        this._router.get('/tienda/:nombre', this.getTienda)
        this._router.get('/producto/:nombre', this.getProducto)
        this._router.post('/nuevoProducto', this.nuevoProductoPost)
        this._router.post('/nuevoTienda', this.nuevoTiendaPost)
        this._router.post('/actualizaProducto/:nombre', this.actualizaProducto)
        this._router.post('/actualizaTienda/:nombre', this.actualizaTienda)
        this._router.get('/borrarProducto/:nombre', this.deleteProducto)
        this._router.get('/borrarTienda/:nombre', this.deleteTienda)
        this._router.get('/aggreProdu', this.getProdu)
        
    }
}




const obj = new ProductoRoutes()
obj.misRutas()
export const productoRoutes = obj.router
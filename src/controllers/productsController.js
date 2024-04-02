
const db = require ('../database/models');
const category = require('../database/models/category');

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const controller = {
	// Root - Show all products
	index: (req, res) => {

		db.Product.findAll()
		.then(products=> {
			return  res.render('products',{
				products,
				toThousand
			})
		})
		.catch(error=>console.log(error))
	},

	// Detail - Detail from one product
	detail: (req, res) => {
		db.Product.findByPk(req.params.id)
		.then(product=>{
			return res.render('detail', {...product.dataValues, toThousand})
		})
		.catch(error=>console.log(error))
	},

	// Create - Form to create
	create: (req, res) => {

		db.Category.findAll({
			order:['name']
		})
		.then(categories=>{
			return res.render('product-create-form'),{
				categories
			}
		})
		.catch(error=>console.log(error))
		
	},
	
	// Create -  Method to store
	store: (req, res) => {

		const {name,description,price,discount,categoryId} = req.body

		db.Product.create({
			name: name.trim(),
			price,
			discount,
			description: description.trim(),
			categoryId
		})
		.then(newProduct=>{
			return res.redirect('/products/detail/'+ newProduct.id)
		})
		.catch(error=>console.log(error))
		
	},

	// Update - Form to edit
	edit: (req, res) => {

		const categories = db.Category.findAll({
			order:['name']
		})
		const product = db.Product.findByPk(req.params.id);

		Promise.all([categories,product])
		.then(([categories,product])=>{
			return res.render('product-edit-form',{
				...product.dataValues,
				categories
			})
		})
		.catch(error=>console.log(error))

		// const product = products.find(product => product.id === +req.params.id)
		// return res.render('product-edit-form',{
		// 	...product
		// })
	},
	// Update - Method to update
	update: (req, res) => {
		const{name, price, discount, description, categoryId}= req.body;

		db.Product.update(
		{
			name: name.trim(),
			price,
			discount,
			description: description.trim(),
			categoryId
		},
		{
			where: {
				id : req.params.id
			}

		})
		.then(response =>{
			console.log(response)
			return res.redirect('/products/detail/' + req.params.id)
		})
		.catch(error=>console.log(error))


		
	},

	// Delete - Delete one product from DB
	// destroy : (req, res) => {
	// 	const product = products.find(product => product.id === +req.params.id)

	// 	fs.writeFileSync(productsFilePath, JSON.stringify(product), 'utf-8')

	// 	return res.redirect('/')

	// }

	// Delete - Delete one product from DB
	destroy: (req, res) => {

		db.Product.destroy({
			where:{
				id: req.params.id
			}
		})
		.then(response => {
			console.log(response)
			return res.redirect('/products')

		})
		.catch(error=>console.log(error))

    // const productId = +req.params.id;
    
    // // Filtra los productos para mantener solo aquellos que no tienen el ID igual al ID a eliminar
    // const productsUpdated = products.filter(product => product.id !== productId);

    // fs.writeFileSync(productsFilePath, JSON.stringify(productsUpdated), 'utf-8');

    // return res.redirect('/');
}

};

module.exports = controller;
var mongoose = require('mongoose')

const favouriteSchema = new mongoose.Schema ({
    userId : {type: mongoose.Schema.Types.ObjectId, ref: 'Auth'},
    productId :  {type: mongoose.Schema.Types.ObjectId, ref: 'Product'},
}, {
    collection: 'favourites'
})

let favouriteModel = mongoose.model('Favourite', favouriteSchema)
module.exports = favouriteModel

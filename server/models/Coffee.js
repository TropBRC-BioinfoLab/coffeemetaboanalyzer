const mongoose = require('mongoose');

const CoffeeSchema = new mongoose.Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: String,
    origin: String,
    photos: [String],
    description: String,
    brand: String,
    quantMass: {type: mongoose.Schema.Types.ObjectId, ref: 'QuantMass'},
    metaboliteData: { type: mongoose.Schema.Types.ObjectId, ref: 'MetaboliteData' },
});

const CoffeeModel = mongoose.model('Coffee', CoffeeSchema);

module.exports = CoffeeModel;
const mongoose = require('mongoose');

const QuantMassSchema = new mongoose.Schema({
    tagName: String,
    datametabolite: [
        {
            metaboliteName: {
                type: String,

            },
            quantMass: {
                type: Number,
            },
            massSpectrum: {
                type: String,
            },
        }
    ]
});




const QuantMassModel = mongoose.model('QuantMass', QuantMassSchema);

module.exports = QuantMassModel;
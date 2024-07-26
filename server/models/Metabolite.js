const mongoose = require('mongoose');

const dataMetaboliteSchema = mongoose.Schema({
    listName: String,
    listMetabolite: 
        [
            {
                metaboliteName: {
                    type: String,

                },
                metaboliteMass: {
                    type: Number,
                },

            }
        ]
});

const MetaboliteDataSchema = new mongoose.Schema({
    tagName: String,
    dataMetabolite: [dataMetaboliteSchema],

});




const MetaboliteDataModel = mongoose.model('MetaboliteData', MetaboliteDataSchema);

module.exports = MetaboliteDataModel;
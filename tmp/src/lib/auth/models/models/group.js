var mongoose = require('mongoose');

var groupSchema = mongoose.Schema({

    name: String,
    access: Number

});

module.exports = mongoose.model('Group', groupSchema);

const mongoose = require('mongoose')

const NewsScehma = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },

    created: {
        type: Date,
        require: true,
        default:Date.now()
    },

    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Reporter'
    }
})

const News= mongoose.model('News', NewsScehma)
module.exports = News
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const validator = require('validator')
const jwt = require('jsonwebtoken')

const reporterScehma = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true

    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid re inter your email ')
            }
        }
    },
    age: {
        type: Number,
        require: false,
        validate(value) {
            if (value < 0) {
                throw new Error('age not valid')
            }
        }

    },

    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7

    },

    PhoneNumber: {
        type: Number,
        require: true,
        trim: true,
        min: 11,
        max: 11,
    },

    tokens: [{
        type: String,
        required: true
    }]
})

/////////////////////Relations**

reporterScehma.virtual('news', {
    ref: 'News',
    localField: '_id',
    foreignField: 'owner'
})


reporterScehma.statics.findByCredentials = async (email, password) => {

    const reporter = await User.findOne({
        email
    })
    if (!reporter) {
        throw new Error('Unable to login.. Please check email or password')
    }

    const isMatch = await bcrypt.compare(password, reporter.password)
    if (!isMatch) {
        throw new Error('Unable to login.. Please check email or password')
    }

    return reporter
}


reporterScehma.pre('save', async function (next) {
    const reporter = this
    if (reporter.isModified('password'))
        reporter.password = await bcrypt.hash(reporter.password, 6)
    next()
})


reporterScehma.methods.generateToken = async function () {
    const reporter = this

    const token = jwt.sign({
        _id: reporter._id.toString()
    }, 'nodecourse')
    reporter.tokens = reporter.tokens.concat(token)
    await reporter.save()
    return token
}

reporterScehma.methods.toJSON = function () {
    const reporter = this

    const reporterObject = reporter.toObject()
    delete reporterObject.password
    delete reporterObject.tokens
    return reporterObject
}


const Reporter = mongoose.model('Reporter', reporterScehma)
module.exports = Reporter
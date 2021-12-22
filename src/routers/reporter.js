const express = require('express')
const router = new express.Router()
const Reporter = require('../models/reporter')
const auth = require('../middelware/auth')


router.post('/reporter', async (req, res) => {
    try {
        const reporter = new Reporter(req.body)
        const token = await reporter.generateToken()
        await reporter.save()
        res.status(200).send({
            reporter,
            token
        })
    } catch (e) {
        res.status(400).send(e.message)
    }
})

router.post('/login', async (req, res) => {
    try {
        const reporter = await Reporter.findByCredentials(req.body.email, req.body.password)
        const token = await reporter.generateToken()
        res.status(200).send({
            reporter,
            token
        })
    } catch (error) {
        res.status(500).send(error.message)
    }
})

// all*
router.get('/reporter', auth, (req, res) => {
    User.find({}).then((data) => {
        res.status(200).send(data)
    }).catch((e) => {
        res.status(500).send(e)
    })
})

// by id
router.get('/reporter/:id', auth, (req, res) => {
    const _id = req.params.id
    Reporter.findById(_id).then((reporter) => {
        if (!reporter) {
            return res.status(404).send('Unable to find user')
        }
        res.status(200).send(reporter)
    }).catch((error) => {
        res.status(500).send(error)
    })
})


// logout
router.delete('/logout', auth, async (req, res) => {
    try {
        req.reporter.tokens = req.reporter.tokens.filter((el) => {

            return el !== req.token

        })
        await req.reporter.save()
        res.status(200).send('Logout successfully')
    } catch (e) {
        res.status(500).send(e.message)
    }
})

// logout all
router.delete('/logoutall', auth, async (req, res) => {
    try {
        req.reporter.tokens = []
        await req.reporter.save()
        res.status(200).send('Logout all success')
    } catch (e) {
        res.status(500).send(e.message)
    }
})


// update

router.patch('/reporter/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'age', 'password']
    let isValid = updates.every((el) => allowedUpdates.includes(el))
    if (!isValid) {
        return res.status(400).send("Can't update")
    }

    try {
        const _id = req.params.id
        const reporter = await User.findById(_id)
        if (!reporter) {
            return res.status(404).send('No user is found')
        }

        updates.forEach((el) => (reporter[el] = req.body[el]))
        await reporter.save()
        res.status(200).send(reporter)
    } catch (error) {
        res.status(500).send(error.message)
    }

})

router.delete('/reporter/:id', auth, async (req, res) => {
    try {
        const _id = req.params.id
        const reporter = await User.findByIdAndDelete(_id)
        if (!reporter) {
            return res.status(404).send('No user is found')
        }
        res.status(200).send(reporter)
    } catch (error) {
        res.status(500).send(error)
    }
})

module.exports = router
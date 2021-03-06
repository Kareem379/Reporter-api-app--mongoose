const express = require('express')
const News = require('../models/news')
const router = new express.Router()
const auth = require('../middelware/auth')


// get
router.get('/news/:id',auth,async(req,res)=>{
    try{
        const _id = req.params.id
        const news = await Task.findOne({_id,owner:req.user._id})
        if(!news){
            return res.status(404).send('Not found')
        }
        res.status(200).send(news)
    }
    catch(e){
        res.status(500).send(e.message)
    }
})

router.get('/news',auth,async(req,res)=>{
    try{
        await req.user.populate('news')
        res.send(req.user.tasks)
    }
    catch(e){
        res.status(500).send(e.message)
    }
})


// post
router.post('/news',auth,async(req,res)=>{
    try{
        
        const news = new News({...req.body,owner:req._id})
        await news.save()
        res.status(201).send(news)
    }
    catch(e){
        res.status(400).send(e.message)
    }
})


// patch
router.patch('/news/:id',auth,async(req,res)=>{
    try{
        const updates = Object.keys(req.body)
        const allowedupdates = ['description','completed']
        const isValid = updates.every((update)=> allowedupdates.includes(update))
        if(!isValid){
            return res.status(400).send("Can't update title")
        }
        const _id = req.params.id
        const news = await News.findOne({_id,owner:req.user._id}) 
        if(!news){
            return res.status(404).send("No news is found")
        }
        updates.forEach((update)=> news[update]= req.body[update])
        
       await news.save()
        res.status(200).send(news)

    }
    catch(e){
        res.status(400).send(e.message)
    }
})

// delete
router.delete('/news/:id',auth,async(req,res)=>{
    try{
        const _id = req.params.id
        const news = await News.findOneAndDelete({_id,owner:req.user._id})
        if(!news){
            return res.status(404).send('Not found')
        }
        res.status(200).send(news)
    }
    catch(e){
        res.status(500).send(e.message)
    }
    
})

module.exports = router
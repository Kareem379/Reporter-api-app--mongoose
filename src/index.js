const express = require('express')
const reporterRouter = require('./routers/reporter')
const newsRouter = require('./routers/news')
 require('./db/mongoose')
const jwt = require('jsonwebtoken')
const News = require('./models/news')
const Reporter = require('./models/reporter')
 const bcrypt = require('bcryptjs')

const app = express()
app.use(express.json())
const port = process.env.PORT || 3000
app.use(reporterRouter)
app.use(newsRouter)



const passwordFunction = async () =>{
    const password = 'A123456'

    const hashedPassword = await bcrypt.hash(password,8)                                                  
    const compare = await bcrypt.compare('A123456',hashedPassword)

}
passwordFunction()



const myToken = async () =>{
    
    const token = jwt.sign({_id:'123'},'nodecourse')   
     const tokenVerify = jwt.verify(token,'nodecourse')
   
}
myToken()

const main = async () =>{
    // const reporter = await User.findById('')
    await reporter.populate('news')
 
}
main()



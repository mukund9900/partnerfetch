import express, { Express } from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import appRoutes from './routes'

const app: Express = express()

const PORT: string | number = process.env.PORT || 4000
var bodyParser = require('body-parser')


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(cors())
app.use(appRoutes)

const uri: string = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.5yurh.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`
// const options = { useNewUrlParser: true, useUnifiedTopology: true }
// mongoose.set('useFindAndModify', false)

mongoose
    .connect(uri)
    .then(() =>
        app.listen(PORT, () =>{
            console.log(`Server running on http://localhost:${PORT}`)
        })
    )
    .catch((error) => {
        throw error
    })

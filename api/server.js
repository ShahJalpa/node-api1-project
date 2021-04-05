// BUILD YOUR SERVER HERE
const express = require("express")
const User = require("./users/model.js")

const server = express()

server.use(express.json())

//Post request
server.post("/api/users", (req, res) => {
    const newUser = req.body
    console.log(newUser.name, newUser.bio)
    if(!newUser.name || !newUser.bio){
        res.status(400).json("Please provide name and bio for the user")
    }else{
        User.insert(newUser)
            .then(user => {
                res.status(201).json(user)
            })
            .catch(err => {
                res.status(500).json({ message: "There was an error while saving the user to the database" })
            })
    }
})

//Get request
server.get("/api/users", (req, res) => {
    User.find()
        .then(users => {
            console.log(users)
            res.status(200).json(users)
        })
        .catch(err => {
            res.status(500).json({ message: "The users information could not be retrieved" })
        })
})

//Get request with an id
server.get("/api/users/:id", (req, res) => {
   const idVar = req.params.id
    User.findById(idVar)
        .then(user => {
            console.log(user)
            if(!user){
                res.status(404).json({ message: "The user with the specified ID does not exist" })
            }else{
                res.status(200).json(user)
            }
        })
        .catch(err => {
            res.status(500).json({ message: "The user information could not be retrieved" })
        })
})

//delete request
server.delete("/api/users/:id", async (req, res) => {
    try{
        const {id} = req.params
        const deleteUser = await User.remove(id)
        if(!deleteUser){
            res.status(404).json({ message: "The user with the specified ID does not exist" })
        }else{
            res.status(200).json(deleteUser)
        }
    }catch{
        res.status(500).json({ message: "The user could not be removed" })
    }
})

//Put request
server.put("/api/users/:id", (req, res) => {
    const {id} = req.params
    const updateUser = req.body

    if(!updateUser.name || updateUser.bio){
        res.status(400).json({ message: "Please provide name and bio for the user" })
    }else{
        User.update(id, updateUser)
            .then(user => {
                if(!user){
                    res.status(404).json({ message: "The user with the specified ID does not exist" })
                }else{
                    res.status(200).json(user)
                }
            })
            .catch(err => {
                res.status(500).json({ message: "The user information could not be modified" })
            })
    }
})

module.exports = server; // EXPORT YOUR SERVER instead of {}

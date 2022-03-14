import mongoose from "mongoose"

const pokemonSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    level: {
        type: Number,
        required: true
    },
    picture: {
        type: String,  
    },
    user: {
        type: mongoose.Schema.Types.ObjectId, //object id pour mettre en relation l'utilisateur et le pokemon
        ref: "User" //la reference de la relation
    }
})

const Pokemon = mongoose.model('Pokemon', pokemonSchema)

export default Pokemon



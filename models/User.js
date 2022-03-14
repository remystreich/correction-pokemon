import mongoose from "mongoose"

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, 'Pas de nom'],
    },
    firstname: {
        type: String,
        required: [true, 'Pas de prénom'],
    },
    mail: {
        type: String,
        required: [true, 'Pas de mail'],
    },
    password: {
        type: String,
        required: [true, 'Pas de mot de passe']
    },
    badge: {
        type: Array,
    },
    pokemon: [{ type: mongoose.Schema.Types.ObjectId, ref: "Pokemon" }] //permet d'inserer les object id des pokemon de l'utilisateur
})

const User = mongoose.model('User', userSchema)

export default User


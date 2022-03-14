
import User from '../models/User.js'
import { cryptPassword } from '../customDependances/cryptPassword.js';
import { comparePassword } from '../customDependances/cryptPassword.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url); //retourne le chemin absolu du fichier en cours
const __dirname = path.dirname(__filename); //retourne le chemin absolu de la racine du projet
const bdgeFileUrl = path.join(__dirname, '..', 'badge.json')//Je créé le chemin absolu qui me permetra d'acceder à mes fichiers (badge)

export class UserController {
    
    static async subscribe(user) {
        let objerror = {
            errors: []
        };
        let userSaved = null;
        user.password = await cryptPassword(user.password)//je crypte le mot de passe de l'utilisateur avant de l'inséré en base
        const newUser = new User(user)
        let err = await newUser.validateSync()// cette methode retourne une erreur si notre objet n'est pas conforme au model
        if (err) {
            for (let i = 0; i < Object.values(err.errors).length; i++) { //je parcours les erreurs
                objerror.errors.push(Object.values(err.errors)[i].message); //je les inseres dans mon tableau d'erreur
            }
            return objerror; //je retourne mon tableau d'erreur si il y en a
        }
        let findUser = await User.findOne({ mail: user.mail }) //je verifie si un utilisateur avec le meme mail existe en base
        if (!findUser) { // si aucun utilisateur en base
            userSaved = await newUser.save() //je l'insere en base
            return userSaved
        } else { // si il y en a un en base
            objerror.errors.push("Ce mail à deja été utilisé")//j'insere une erreur dans mon tableau d'erreur
            return objerror// et je retourne mon tableau d'erreur
        }
    }

    static async getUsers() {
        return await User.find()
    }

    static async getUser(id, excludeFields) {
        return await User.findOne({ _id: id }, excludeFields)
    }

    static async updateUser(id, updtatedUser) {
        return await User.updateOne({ _id: id }, updtatedUser)
    }

    static async getUserPokemons(id) {
        let user = await User.findOne({ _id: id }).populate('pokemon')// cherche tout les pokemon correspondants aux ID dans le tableau de pokemon de l'utilisateur
        return user.pokemon
    }

    static async deleteUser(id) {
        return await User.deleteOne({ _id: id })
    }

    static async login(body) {
        let objerror = {
            error: ""
        }
        let user = await User.findOne({ mail: body.mail })
        if (user) {
            let isSamePassword = await comparePassword(body.password, user.password)//je compare le mot de passe clair et le mot de passe crypté en base
            if (isSamePassword) {
                return user
            } else {
                objerror.error = "mot de passe incorect";
                return objerror
            }
        } else {
            objerror.error = "aucun utilisateur avec cet e-mail"
            return objerror
        }
    }

    static async checkBadge(id) {
        let user = await this.getUser(id)
        if (user) {
            let pokemonNumber = user.pokemon.length
            let badgeArray = JSON.parse(fs.readFileSync(bdgeFileUrl));
            badgeArray.forEach(async badge => {
                let index = user.badge.map(function (userBadge) { return userBadge.name; }).indexOf(badge.name);
                if (index === -1 && pokemonNumber >= badge.condition) {
                    await this.updateUser({ _id: id }, { $push: { badge: badge } })
                }
            })
            return user
        }
    }
}
export default UserController


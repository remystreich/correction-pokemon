import Pokemon from '../models/Pokemon.js'
import UserController from '../controllers/User.js'
import path from 'path';
import { fileURLToPath } from 'url'; //pour pouvoir utiliser les chemin absolu
import pictureManager from '../customDependances/pictureManager.js';

const __filename = fileURLToPath(import.meta.url); //retourne le chemin absolu du fichier en cours
const __dirname = path.dirname(__filename); //retourne le chemin absolu de la racine du projet
const FileUrl = path.join(__dirname, '..', 'assets/images/')//Je créé le chemin absolu qui me permetra d'enregistrer mes fichiers (image)

export class PokemonController {

    static async addPokemon(req) {
        let objerror = {
            errors: []
        }
        const directory = `${FileUrl}/pokeImages/${req.session.userId}` // chemin qui correspond au dossier de l'image du pokemon
        const pokemon = new Pokemon(req.body)
        pokemon.user = req.session.userId
        let err = await pokemon.validateSync() // cette methode retourne une erreur si notre objet n'est pas conforme au model
        if (err) {
            for (let i = 0; i < Object.values(err.errors).length; i++) { //je parcours les erreurs
                objerror.errors.push(Object.values(err.errors)[i].message);//je les inseres dans mon tableau d'erreur
            }
            return objerror //je retourne mon tableau d'erreur si il y en a
        }
        let picture = await pictureManager.addPicture(req.files.picture, directory, pokemon._id); //j'ajoute une image dans le dossier specifié
        pokemon.picture = picture
        await pokemon.save()
        await UserController.updateUser({ _id: req.session.userId }, { $push: { pokemon: pokemon._id } }); // je push l'id du pokemon dans le tableau pokemon de l'utilisateur
        await UserController.checkBadge(req.session.userId) // je verifie si je doit ajouter un badge ou non
        return pokemon
    }

    static async getPokemons() {
        return await Pokemon.find()
    }

    static async getPokemon(id) {
        return await Pokemon.findOne({ _id: id })
    }

    static async updatePokemon(req) {
        let updtatedPokemon = req.body
        let pkm = await Pokemon.updateOne({ _id: req.param.id }, updtatedPokemon)
        if (req.files) {// si un fichier se trouve dans le corps de la requette
            const directory = `${FileUrl}/pokeImages/${req.session.userId}`// je defini le repertoire 
            await pictureManager.removePictureWthoutMimeType(directory, req.param.id)// j'efface l'image precedente
            await pictureManager.addPicture(req.files.picture, directory, req.params.id)// et j'ajoute la nouvelle
        }
    }

    static async deletePokemon(id, userId) {
        const directory = `${FileUrl}/pokeImages/${userId}/` // je set le repertoire de mon image
        let deletedPoke = await Pokemon.deleteOne({ _id: id })
        if (deletedPoke.deletedCount === 1) {
           await pictureManager.removePictureWthoutMimeType(directory, id) // et je la supprime si le pokemon est bien supprimé
           await UserController.updateUser({ _id: userId }, { $pull: { pokemon: id } });
        }
        return deletedPoke
    }
}


export default PokemonController

import routeGuard from '../customDependances/authGuard.js'
import { Router } from 'express' //importe uniquement la methode Router() d'express
import PokemonController from '../controllers/Pokemon.js'

const pokemonRouter = Router()

pokemonRouter.get('/addPokemon', routeGuard, async (req, res) => {

    res.render('template/pokemon/formPokemon.html.twig', {
        user: req.session.user
    })
})

pokemonRouter.post('/addPokemon', routeGuard, async (req, res) => {
    console.log(req.files.picture);
    let newPokemon = await PokemonController.addPokemon(req)
    if (newPokemon && !newPokemon.errors) {
        res.redirect('/home')
    } else {
        res.render('template/pokemon/formPokemon.html.twig', {
            user: req.session.user,
            error: newPokemon.errors
        })
    }
})

pokemonRouter.get('/updatePokemon/:id', routeGuard, async (req, res) => {
    const pokemon = await PokemonController.getPokemon(req.params.id)
    res.render('template/pokemon/formPokemon.html.twig', {
        user: req.session.user,
        action: "updatePokemon",
        pokemon: pokemon
    })
})

pokemonRouter.post('/updatePokemon/:id', routeGuard, async (req, res) => {
    const updatedPokemon = PokemonController.updatePokemon(req)
    if (updatedPokemon) {
        res.redirect('/home')
    } else {
        res.render('template/pokemon/formPokemon.html.twig', {
            user: req.session.user,
            action: "updatePokemon",
            pokemon: pokemon
        })
    }
})

pokemonRouter.post('/deletePokemon/:id', routeGuard, async (req, res) => {
    await PokemonController.deletePokemon(req.params.id, req.session.userId)
    res.redirect('/home')
})

export default pokemonRouter

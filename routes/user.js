import routeGuard from '../customDependances/authGuard.js'
import { Router } from 'express' //importe uniquement la methode Router() d'express
import UserController from '../controllers/User.js'

const userRouter = Router()

userRouter.get('/subscribe', async (req, res) => {
    res.render('template/user/subscribe.html.twig')
})

userRouter.post('/subscribe', async (req, res) => {
    let newUser = await UserController.subscribe(req.body, req.session.userId)
    if (newUser && !newUser.errors) {
        req.session.userId = newUser._id
        res.redirect('/home')
    } else {
        res.render('template/user/subscribe.html.twig', {
            errors: newUser.errors
        })
    }
})

userRouter.get('/login', async (req, res) => {
    res.render('template/user/login.html.twig')
})

userRouter.post('/login', async (req, res) => {
    let user = await UserController.login(req.body);
    if (user && !user.error) {
        req.session.userId = user._id
        res.redirect('/home')
    } else {
        res.render('template/user/login.html.twig', {
            error: user.err
        })
    }
})

userRouter.get('/home', routeGuard, async (req, res) => {
    let poke = await UserController.getUserPokemons(req.session.userId)
    res.render('template/user/listPokemon.html.twig', {
        "user": req.session.user,
        "pokemons": poke
    })
})

userRouter.get('/disconnect', routeGuard, async (req, res) => {
    req.session.destroy()
    res.redirect('/login')
})

export default userRouter



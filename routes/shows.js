const express = require("express")
const router = express.Router()
const {User, Show} = require("../models/index")
const {check, validationResult} = require('express-validator')

router.use(express.json())

//get all shows
router.get('/', async (req, res) => {
    const getShows = await Show.findAll()
    res.json(getShows)
})

//get specific show
router.get('/:id', async (req, res) => {
    const getSpecific = await Show.findByPk(req.params.id)
    res.json(getSpecific)
})

//get same genre shows
router.get('/genres/:genre', async (req, res) => {
    const getSpecific = await Show.findAll({
        where: {
            genre: req.params.genre
        }
    })
    res.json(getSpecific)
})

//updating status to "watched" & allowing an update in rating
router.put('/:id/watched', [

    check("title").isEmpty().trim(),
    check("genre").isEmpty().trim(),
    check("rating").not().isEmpty().trim().isFloat({min: 1, max: 5})
    .withMessage("Enter a rating between 1 & 5"),
    check("status").not().isEmpty().trim().matches("watched")
    .withMessage("Must enter status 'watched'")
    
    ], async (req, res) => {
    
        const errors = validationResult(req)
    
        if(!errors.isEmpty()) {
            res.send({error: errors.array()})
        } else {
            const showList = await Show.findByPk(req.params.id)
            const newRatingStatus = {rating: req.body.rating, status: req.body.status}
            await showList.update(newRatingStatus)
            res.json(await Show.findAll())
        }
    })

//switching "cancelled" to "on-going" or vice versa
router.put('/:id/updates', [

    check("title").isEmpty().trim(),
    check("genre").isEmpty().trim(),
    check("rating").isEmpty().trim(),
    check("status").not().isEmpty().trim().isIn(["cancelled", "on-going"])
    .withMessage("Must enter either status: 'on-going' or 'cancelled")
    
    ], async (req, res) => {
    
        const errors = validationResult(req)
    
        if(!errors.isEmpty()) {
            res.send({error: errors.array()})
        } else {
            const showList = await Show.findByPk(req.params.id)
            const newStatus = {status: req.body.status}
            await showList.update(newStatus)
            res.json(await Show.findAll())
        }
    })

//delete a show
router.delete('/:id', async (req, res) => {
    const showList = await Show.findAll()
    const min = showList[0].dataValues.id;
    const max = showList[showList.length - 1].dataValues.id

    if(req.params.id < min | req.params.id > max) {
        res.send({error: `The 'id' specified doesn't exist! Enter an 'id' between ${min} & ${max} you'd like to delete.`})
    } else {
        await Show.destroy({where: {id: req.params.id}})
        res.send(await Show.findAll())
    }
})
module.exports = router;
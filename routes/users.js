const express = require("express")
const router = express.Router()
const {User, Show} = require("../models/index")
const {check, validationResult} = require('express-validator')

router.use(express.json())

//get all
router.get('/', async (req, res) => {
    const getUsers = await User.findAll()
    res.json(getUsers)
})

//get specific user
router.get('/:id', async (req, res) => {
    const getSpecific = await User.findByPk(req.params.id)
    res.json(getSpecific)
})

//get user shows 
router.get('/:id/shows', async (req, res) => {
    const getUser = await User.findByPk(req.params.id)
        const showList = await getUser.getShows()
        res.json(showList)
})

//updating status to "watched"
router.put('/:id/shows/:show', [

check("title").isEmpty().trim(),
check("genre").isEmpty().trim(),
check("rating").isEmpty().trim(),
check("status").not().isEmpty().trim().matches("watched")
.withMessage("Must enter status: 'watched'")

], async (req, res) => {

    const user = await User.findByPk(req.params.id)
    const userShows = await user.getShows()

    const min = userShows[0].dataValues.id; //first associated show with 'user'
    const max = userShows[userShows.length - 1].dataValues.id //last associated show with 'user'

    const errors = validationResult(req)

    if(!errors.isEmpty()) {
        res.send({error: errors.array()})
    } else if (req.params.show < min | req.params.show > max) {
        // if show < 4 OR show > 6 (user2 having related shows in this case with 'id' 4-6, then...)
        res.send({error: `User doesn't have this show in their collection. Pick an 'id' between ${min} & ${max}`})
    } else {
        const showToUpdate = await Show.findByPk(req.params.show)
        const newStatus = {status: req.body.status}
        await showToUpdate.update(newStatus)
        res.json(await user.getShows())
    }
})

module.exports = router;
const express = require('express');
const { sessionChecker } = require('../middleware/auth');
const User = require('../models/users');
const fetch = require('node-fetch');
const router = express.Router();

function getIngridients(json, number = 0) {
    let ingridients = [];
    for (let i = 1; i < 20; i++) {
        if (json.meals[number]['strIngredient' + i]) {
            ingridients.push(json.meals[number]['strIngredient' + i] + ' : ' + json.meals[number]['strMeasure' + i]);
        }
    }
    json.meals[number].ingridients = ingridients;
    return ingridients;
}

async function fetchIngridient(json, number = 0) {
    let arrayWithIngridients = [];
    for (let j = 0; j < json.meals.length; j++) {
        let resp = await fetch(`http://www.themealdb.com/api/json/v1/1/lookup.php?i=${json.meals[j].idMeal}`, {})
        let data = await resp.json();
        arrayWithIngridients.push(getIngridients(data));
    }
    return arrayWithIngridients;
}

function getVideo(json) {
    let str = json.meals[0].strYoutube;
    json.meals[0].strYoutube = str.split('=')[1];
    return str.split('=')[1];
}


router.get('/getbreakfast', (req, res) => {
    if (req.query.ingridient) {
        fetch(`http://www.themealdb.com/api/json/v1/1/filter.php?i=${req.query.ingridient}`)
            .then(res => data = res.json())
            .then(async json => {
                fetchIngridient(json)
            })
            .then(data => {
                data.json()
            })
            .then(data => {
                res.render('show', { json: json, ingridientsArray: data })
            })
    } else if (req.query.cuntry) {
        fetch(`http://www.themealdb.com/api/json/v1/1/filter.php?a=${req.query.cuntry}`)
            .then(res => data = res.json())
            .then(async json => {
                res.render('show', { json: json, ingridientsArray: await fetchIngridient(json) })
            })
    } else {
        fetch('http://www.themealdb.com/api/json/v1/1/random.php')
            .then(res => data = res.json())
            .then(json => {
                fetch(`http://www.themealdb.com/api/json/v1/1/lookup.php?i=${json.meals[0].idMeal}`)
                    .then(res => data = res.json())
                    .then(json => {
                        console.log(json.meals[0].strYoutube);
                        res.render('show', { json: json, ingridients: getIngridients(json), video: getVideo(json) })
                    });
            });
    }
})

router.get('/getbreakfast/:id', (req, res) => {
    fetch(`http://www.themealdb.com/api/json/v1/1/search.php?s=${req.params.id}`)
        .then(res => data = res.json())
        .then(json => {
            res.render('show', { json: json, ingridients: getIngridients(json), video: getVideo(json) })
        })
})

router.get('/vegan', (req, res) => {
    let ingridientsForBreakfast = ['Rice', 'Avocado', 'Carrots', 'Broccoli', 'Potatoes']
    let coin = Math.floor(Math.random() * (4 - 0) + 0);
    fetch(`http://www.themealdb.com/api/json/v1/1/filter.php?i=${ingridientsForBreakfast[coin]}`)
        .then(res => data = res.json())
        .then(json => {
            res.render('show', { json })
        })
});

router.get('/breakfast', (req, res) => {
    let ingridientsForBreakfast = ['Salmon', 'Avocado', 'Carrots', 'Cheese', 'Eggs']
    let coin = Math.floor(Math.random() * (4 - 0) + 0);
    fetch(`http://www.themealdb.com/api/json/v1/1/filter.php?i=${ingridientsForBreakfast[coin]}`)
        .then(res => data = res.json())
        .then(json => {
            res.render('show', { json })
        })
});

router.get('/lunch', (req, res) => {
    let ingridientsForBreakfast = ['Beef', 'Pork', 'Chicken', 'Broccoli', 'Lamb']
    let coin = Math.floor(Math.random() * (4 - 0) + 0);
    fetch(`http://www.themealdb.com/api/json/v1/1/filter.php?i=${ingridientsForBreakfast[coin]}`)
        .then(res => data = res.json())
        .then(json => {
            res.render('show', { json })
        })
});

router.get('/dinner', (req, res) => {
    let ingridientsForBreakfast = ['Feta', 'Avocado', 'Mushrooms', 'Cheese', 'Milk']
    let coin = Math.floor(Math.random() * (4 - 0) + 0);
    fetch(`http://www.themealdb.com/api/json/v1/1/filter.php?i=${ingridientsForBreakfast[coin]}`)
        .then(res => data = res.json())
        .then(json => {
            res.render('show', { json })
        })
});




module.exports = router;
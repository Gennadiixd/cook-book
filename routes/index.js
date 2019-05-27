const express = require('express');
const { sessionChecker } = require('../middleware/auth');
const User = require('../models/users');
const fetch = require('node-fetch');
const router = express.Router();




router.get('/', (req, res) => {
  let mealType = {};
  mealType.breakfast = true;

  fetch('http://www.themealdb.com/api/json/v1/1/list.php?a=list')
    .then(res => data = res.json())
    .then(json => {
      res.render('order', { json })
    })
});

router.get('/index/getbreakfast', (req, res) => {
  if (req.query.ingridient) {
    fetch(`http://www.themealdb.com/api/json/v1/1/filter.php?i=${req.query.ingridient}`)
      .then(res => data = res.json())
      .then(json => {
        res.render('show', { json })
      })
  } else if (req.query.cuntry) {
    fetch(`http://www.themealdb.com/api/json/v1/1/filter.php?a=${req.query.cuntry}`)
      .then(res => data = res.json())
      .then(json => {
        res.render('show', { json })
      })
  } else {
    fetch('http://www.themealdb.com/api/json/v1/1/random.php')
      .then(res => data = res.json())
      .then(json => {
        fetch(`http://www.themealdb.com/api/json/v1/1/lookup.php?i=${json.meals[0].idMeal}`)
          .then(res => data = res.json())
          .then(json => {
            res.render('show', { json: json, ingridients: getIngridients(json) })
          });
      });
  }
})

router.get('/index/getbreakfast/:id', (req, res) => {
  fetch(`http://www.themealdb.com/api/json/v1/1/search.php?s=${req.params.id}`)
    .then(res => data = res.json())
    .then(json => {
      res.render('show', { json: json, ingridients: getIngridients(json) })
    })
})
router.get('/breakfast', (req, res) => {
  res.render('index');
});



module.exports = router;
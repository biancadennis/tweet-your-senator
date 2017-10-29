var express = require('express');
var router = express.Router();
var axios = require('axios')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { zipcode: 'Express' });
});

router.post('/', function(request, response){
  zip = request.body.zipcode
  response.redirect(`/choose-congressman-${zip}`)
})

router.get('/choose-congressman-:zip', function(req, res, next) {
  zipcode = req.params.zip
  axios.get('https://www.googleapis.com/civicinfo/v2/representatives?address=08401&includeOffices=true&roles=legislatorUpperBody&key=AIzaSyDXcOtMfGs87Bwu3gliJD4IUpzWMO-bcVw')
    .then(function(response){
      console.log(response.data.officials)
      official_data = respons.data.officials
    })
  res.render('senator-list');
});
module.exports = router;
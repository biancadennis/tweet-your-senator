var express = require('express');
var router = express.Router();
var axios = require('axios')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

//gets zipcode from input
router.post('/', function(request, response){
  zip = request.body.zipcode
  response.redirect(`/choose-congressman-${zip}`)
})

//queries api using zipcode provided by user and stores info needed in array that is passed to the template for choosing a senator to tweet
router.get('/choose-congressman-:zip', function(req, res, next) {
  zipcode = req.params.zip
  axios.get(`https://www.googleapis.com/civicinfo/v2/representatives?address=${zipcode}&includeOffices=true&roles=legislatorUpperBody&key=AIzaSyDXcOtMfGs87Bwu3gliJD4IUpzWMO-bcVw`)
    .then(function(response){
      user_state      = response.data.normalizedInput.state
      officials_data  = response.data.officials;
      channel0        = response.data.officials[0].channels
      channel1        = response.data.officials[1].channels
      name0           = officials_data[0].name
      name1           = officials_data[1].name
      twitter_handles = [];
      
      channel0.forEach(function(channel) {
        if (channel.type === "Twitter")
        twitter_handles.push(channel.id);
      });
      channel1.forEach(function(channel) {
        if (channel.type === "Twitter")
        twitter_handles.push(channel.id);
      });
      senator_info = [{ 'name': name0, 'twitter': twitter_handles[0]},{'name': name1, 'twitter': twitter_handles[1]}]
      res.render('senator-list', {
        user_state:       user_state,
        senator_info:     senator_info,
        twitter_handles:  twitter_handles
      });
    })
});

//gets twitter handle from senator selected in input
router.post('/choose-congressman-:zip', function(request, response){
  handle = request.body.senator
  response.redirect(`/tweet-your-congressman-${handle}`)
})

//gets handle from input and includes handle in tweet options. These are passed to 
router.get('/tweet-your-congressman-:handle', function(request, response){
  handle  = request.params.handle
  option1 = `Hey ${'@' + handle} trends for #GivingTuesday show people are gearing up in August, start early! https://wholewale.com via @wholewhale`
  option2 = `The best ideas are not in the room, ${'@' + handle}. Find great fundraising supporter stories for #GivingTuesday https://wholewale.com via @wholewhale`
  response.render('tweet-options', {
    handle:   handle,
    option1:  option1,
    option2:  option2
   });
})

//allows user to choose tweet they prefer and send tweet to twitter using web intent
router.post('/tweet-your-congressman-:handle', function(request, response){
  tweet_content = request.body.tweet
  console.log(tweet_content)
  response.redirect(`https://twitter.com/intent/tweet?via=wholewhale&url=https%3A%2F%2Fwholewhale.com%2F&hashtags=GivingTuesday&text=${tweet_content}`)
})
module.exports = router;

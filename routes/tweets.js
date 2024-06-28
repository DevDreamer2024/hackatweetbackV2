var express = require("express");
const Tweet = require("../models/tweets");
var router = express.Router();

router.get("/", (req, res) => {
  Tweet.find().then((data) => {
    if (data) {
      res.json({ result: true, data: data });
    } else {
      res.json({ result: false });
    }
  });
});

router.post("/newtweet", (req, res) => {
  let hashtags = "";
  let hashtagFromRegex = req.body.tweet.match(
    /#(\w*[0-9a-zA-Z]+\w*[0-9a-zA-Z])/g
  );

  if (hashtagFromRegex) {
    hashtags = hashtagFromRegex.map((e) => e.toLowerCase());
  }

  const newTweet = new Tweet({
    name: req.body.name,
    username: req.body.username,
    tweet: req.body.tweet,
    date: new Date(),
    hashtag: hashtags,
    userToken: req.body.userToken, // Replace 'users._id' with the appropriate value
    likes: 0,
  });

  console.log(newTweet);
  newTweet.save().then(() =>
    Tweet.find()
      .populate({ path: "userToken", select: "name username token" })
      .then((data) => {
        res.json({ result: true, data: data });
      })
  );
});

router.get("/:hashtag", (req, res) => {
  Tweet.find({ hashtag: req.params.hashtag.toLocaleLowerCase() }).then(
    (data) => {
      if (data) {
        res.json({ result: true, data: data });
      } else {
        res.json({ result: false });
      }
    }
  );
});

router.delete("/delete", (req, res) => {
  Tweet.deleteOne({ tweet: req.body.tweet, username: req.body.username }).then(
    (data) => {
      if (data.deletedCount > 0) {
        res.json({ result: true, response: "tweet deleted" });
      } else {
        res.json({ result: false });
      }
    }
  );
});

router.put("/togglelike/:id", function (req, res) {
  const id = req.params.id;
  const userToken = req.body.userToken;
  Tweet.findById(id)
    .then((tweet) => {
      if (!tweet) {
        res.status(400).send("tweet not found");
        return;
      }
      if (tweet.likedBy.includes(userToken)) {
        tweet.likes -= 1;
        tweet.likedBy.pull(userToken);
      } else {
        tweet.likes+= 1;
        tweet.likedBy.push(userToken);
      }
      tweet
        .save()
        .then((data) => res.send(data))
        .catch((error) => res.status(400).send(error));
    })
    .catch((error) => res.status(400).send(error));
});

module.exports = router;

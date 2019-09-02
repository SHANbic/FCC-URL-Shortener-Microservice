const dns = require('dns');
const Url = require('../model/url');

//default route
exports.exercice = (req, res) => {
  res.sendFile(process.cwd() + '/views/index.html');
};

//receiving a new url
exports.newUrl = (req, res) => {
  //start #1 : checking if url seems correct
  const httpRegex = /^https?:\/\/www\..*\.\w{2,}$/;
  if (httpRegex.test(req.body.url)) {
    //end # 1a : url does seem correct

    //start #2 : checking if dns sends back a valid address
    const wwwRegex = /www\..*[^\/$]/;
    const url = req.body.url.match(wwwRegex)[0];
    dns.lookup(url, (err, address, family) => {
      if (address !== undefined) {
        //end #2a : address seems legit

        //start #3 : checking if url already exists
        Url.findOne({ original_url: req.body.url }).then(result => {
          //end #3a : url does exist, let's serve it

          if (result) {
            const { original_url, short_url } = result;
            res.send({ original_url, short_url });
          }

          //end #3b : url doesn't exists, let's save then serve it
          else {
            Url.count().then(count => {
              const newUrl = new Url({
                original_url: req.body.url,
                short_url: count
              })
                .save()
                .then(result => {
                  const { original_url, short_url } = result;
                  res.send({ original_url, short_url });
                })
                .catch(err => res.status(400).send(err));
            });
          }
        });

        //end #2b : address seems weird
      } else res.send({ error: 'invalid URL' });
    });

    //end #1b : url seems broken
  } else res.send({ error: 'invalid URL' });
};

exports.redirection = (req, res) => {
  Url.findOne({ short_url: req.params.shortenedUrl }).then(result => {
    if (result) {
      res.redirect(result.original_url);
    } else {
      res.status(404).send({ error: 'No short url found for given input' });
    }
  });
};

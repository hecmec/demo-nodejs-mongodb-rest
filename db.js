const mongoose = require('mongoose');

const schema = mongoose.Schema({value: String});
const Values = mongoose.model('values', schema);

module.exports = {
    // connectDB : function() {
    //     mongoose.connect(process.env.MONGODB_ADDON_URI);
    // },

    connectDB : function() {
        //var uri = 'process.env.MONGODB_ADDON_URI';
        let uri = 'mongodb://27017/cleverTest';
        let promise = mongoose.connect(uri, {
            useMongoClient: true,
            /* other options */
          });
        return promise;
    },

    getVal : function(res) {
        Values.find(function(err, result) {
            if (err) {
                console.log(err);
                res.send('database error');
                return
            }
            var values = {};
            for (var i in result) {
                var val = result[i];
                values[val["_id"]] = val["value"]
            }
            res.render('index', {title: 'NodeJS MongoDB demo', values: values});
        });
    },

    sendVal : function(val, res) {
        var request = new Values({value: val});
        request.save(function (err, result) {
            if (err) {
                console.log(err);
                res.send(JSON.stringify({status: "error", value: "Error, db request failed"}));
                return
            }
            res.status(201).send(JSON.stringify({status: "ok", value: result["value"], id: result["_id"]}));
        });
    },

    delVal : function(id) {
        Values.remove({_id: id}, function(err) {
            if (err) {
                console.log(err);
            }
        });
    }
};

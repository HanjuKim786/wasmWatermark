let config = require('../config/config.json');

var express = require('express');
var http = require('http');
var path = require('path');
var fs = require('fs');
var mime = require('mime');
var url = require('url');
var request = require('request');
const cors = require('cors');
const Sequelize = require('sequelize');
const appinfo = require('../models/appinfo');
const e = require('express');
const modelsPath = path.join(__dirname + "/../models");
const sequelize = new Sequelize(
    config["development"]["database"],
    config["development"]["username"],
    config["development"]["password"],
    {
        host: config["development"]["host"],
        dialect: config["development"]["dialect"]
    }
);
const model1 = require(`../models/appinfo`)(sequelize, Sequelize.DataTypes);
var db = {};

//console.log(config);

/*
//sequelize v5
fs.readdirSync(modelsPath).filter(function(file){
    return (file.indexOf(".") !== 0) && (file !== "server.js");
})
.forEach(function(file){
    //console.log(path.join(__dirname, file));
    //console.log(sequelize);
    let model = sequelize.import(path.join(modelsPath, file));
    db[model.name] = model;
});
*/
db[model1.name] = model1;

Object.keys(db).forEach(function(modelName){
    if("associate" in db[modelName]) {
        db[modelName].associate(db);
    }
});
db.sequelize = sequelize;
db.Sequelize = Sequelize;

//console.log(db);

var app = express();
app.listen(80, function(){
    console.log("listen 80 port");
})
app.use(cors());
app.use(express.static('public'));
app.get('/', function(req, res){
    res.sendFile(__dirname + '/src/index.html');
});
var router = express.Router();

router.route('/pinch').get(function(req, res){
    res.sendFile(__dirname + '/src/pinch.html');
});
app.use('/', router);
//app.set('port', 80);

//http.createServer(app).listen(app.get('port'), function(){});
/*
app.use('/', function(req, res, next){
});
*/
/*
var router = express.Router();

router.route('/').get(function(req, res){
    res.sendFile(__dirname + '/index.html');
})
*/
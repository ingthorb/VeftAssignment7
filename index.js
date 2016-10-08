const express = require('express');
const app = express();
var bodyParser = require('body-parser');

var jsonParser = bodyParser.json();
//Middleware to help us

//Manually kept ID, grows everytime there is a company added into the list
var CompanyID = 0;
//Just as CompanID
var UserID = 0;
//companies include id ,name and punchCount
const companies = [];
//users contain id, name, email and
//punches = [id : Company,  Created: Localtime]
const users = [];

app.get("/api/companies", function(req,res){
  res.type("application/json");
  res.json(companies);
});


app.get("/api/companies/:id", function(req,res)
{
      //Tjekka hvort se int
      var id = parseInt(req.params.id);
      if(id >= companies.length || id < 0)
      {
        res.statusCode(404);
        return res.send("Error 404: No company found");
      }
      res.json(companies[id]);
});

app.get("/api/users/:id/punches", function(req,res)
{
      var User = getUser(req.params.id);
      //The query:
      var companyID = req.query.company;
      if(companyID == undefined)
      {
        //Only return the punches list for the user
        res.json(User.punches);
      }
      else {
        //Return all the punches for said company
        var puncheslist = User.punches;
        var returnlist = [];
        var id = parseInt(req.params.id);
        for(i = 0; i < puncheslist.length; i++)
        {
          var temp = puncheslist[i];
          if(companyID == temp.id)
          {
            returnlist.push(temp);
          }
        }
        res.json(returnlist);
      }
});

app.get("/api/users", function(req,res){
  res.type("application/json");
  res.json(users);
});

app.post("/api/users", jsonParser, function(req, res)
{
  var temp = req.body;
  if(temp.name == undefined || temp.email == undefined)
  {
    res.statusCode = 400;
    return res.send("Error 400: Post syntax incorrect");
  }
  var newUser = {
    id : UserID,
    name : temp.name,
    email : temp.email,
    punches : []
  };
  users.push(newUser);
  UserID++;
  res.json(true);
});

app.post("/api/companies", jsonParser, function(req, res)
{
    var newComp = req.body;
    if(newComp.name == undefined || newComp.punchCount == undefined)
    {
      res.statusCode = 400;
      return res.send("Error 400: Post syntax incorrect");
    }
    var newCompany = {
      id : CompanyID,
      name : newComp.name,
      punchCount : newComp.punchCount
    };
    companies.push(newCompany);
    CompanyID++;
    res.json(true);
});

app.post("/api/users/:id/punches", jsonParser, function(req,res)
{
    //Do we really need the time when the punch was created?
    //The id of the punch is of the company
      var newpunch = req.body;
      var User = getUser(req.params.id);
      var temp = User.punches;
      if(newpunch.id == undefined)
      {
        res.statusCode = 400;
        return res.send("Error 400: Post syntax incorrect");
      }
      else if( companies[newpunch.id] == undefined)
      {
        res.statusCode = 404;
        return res.send("Error 404: No company found");
      }
      var now = new Date();
      var punch = {
        id : newpunch.id,
        created : now
      };
      temp.push(punch);
      res.json(true);
});

//Simple helper function to shorten code
function getUser(id)
{
  var id = parseInt(id);
  if(id >= users.length || id < 0)
  {
    res.statusCode = 404;
    return res.send("Error 404: No company found");
  }
  var User = users[id];
  return User;
}

app.listen(process.env.PORT || 1337);

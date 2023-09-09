let express = require("express");
let app = express();
app.use(express.json());
app.use(function(req,res,next){
    res.header("Access-Control-Allow-Origin","*");
    res.header(
        "Access-Control-Allow-Methods",
        "GET,POST,OPTIONS,PUT,PATCH,DELETE,HEAD"
    );
    res.header(
        "Access-Control-Allow-Headers",
        "Origin ,X-Requested-With, Content-Type, Accept"
    );
    next();
});

// const port = 2410;

var port = process.env.PORT||2410;

app.listen(port ,()=> console.log(`Node app listening on port ${port}!`));

const {Client} = require("pg");
const client = new Client({
    user : "postgres",
    password: "Duggu@2001Papa",
    database: "postgres",
    port : 5432,
    host: "db.vesdrqrmiualsiikdyzc.supabase.co",
    ssl: { rejectUnauthorized: false},
});
let {customerData} = require("./customerData.js");

client.connect(function (res,error) {
    console.log(`Connected!!!`);
});



app.get("/svr/employees", function (req, res, next) {
    let {department="",designation="",gender=""} = req.query;
    console.log("Inside /users get api");
    if(department || designation || gender){
        let query1 = "SELECT * FROM customers WHERE ";
        let a = [];
        let str = "";
        if(department){
            str += " department = $1"
            a = a.concat(department);
        }
        if(designation){
            if(str) str += " AND designation = $2";
            else  str += " designation = $2";
            a = a.concat(designation);
        }
        if(gender){
            if(str) str += " AND gender = $3";
            else  str += " gender = $3";
            a = a.concat(gender);
        }
        query1 += str;
        console.log(query1);
        console.log(a);
        client.query(query1,a,function(err,result){
            if (err) {
                res.status(400).send(err);
            }
            res.send(result.rows);
        });
    }
    else{
        const query = `SELECT * FROM customers`;
        client.query(query, function (err, result) {
            if (err) {
                res.status(400).send(err);
            }
            res.send(result.rows);
        });
    }
});

app.get("/svr/employees/:id", function(req, res, next){
    let code = +req.params.id;
    console.log(code);
    const query = "SELECT * FROM customers WHERE empcode= $1";
    client.query(query,[code], function (err,result){
        if(err){
            res.status(400).send(err);
        }
        res.send(result.rows);
    });
});

app.get("/svr/employees/designation/:desig",function(req,res,next){
    let des = req.params.desig;
    let query = "SELECT * FROM customers WHERE designation= $1";
    client.query(query,[des],function(err,result){
        if(err){
            res.status(400).send(err);
        }
        else res.send(result.rows);
    });
});

app.get("/svr/employees/department/:dep",function(req,res){
    let dep = req.params.dep;
    let sql = "SELECT * FROM customers WHERE department= $1";
    client.query(sql,[dep],function(err,result){
        if(err){
            res.status(400).send(err);
        }
        else res.send(result.rows);
    });
});

app.post("/svr/employees",function(req,res,next){
    console.log("Inside post of user");
    var values = Object.values(req.body);
    console.log(values);
    const query = `INSERT INTO customers(empcode, name, department, designation, salary, gender) VALUES ($1, $2, $3, $4, $5, $6)`;
    client.query(query, values, function (err, result){
        if (err) {
            res.status(400).send(err);
        }
        res.send(`${result.rowCount} insertion successful`);
    });
});



app.put("/svr/employees/:id", function (req, res, next) {
    console.log("Inside put of user");
   let code = req.params.id;
    let body = req.body;
    console.log(body.name);
    let values = [body.name, body.department, body.designation, +body.salary, body.gender, code];
    const query = `UPDATE customers SET name= $1, department= $2, designation= $3, salary= $4, gender= $5  WHERE empcode= $6`;
    client.query(query, values, function (err, result){
        if(err){
            res.status(400).send(err);
        }
        res.send(`${result.rowCount} updation successful`);
    });
});

app.delete("/svr/employees/:id",function(req,res, next){
    let code = +req.params.id; 
    let query = "DELETE From customers WHERE empcode= $1";
    client.query(query,[code],function(err,result){
        if(err){
            res.status(400).send(err);
        }
        res.send(`deleted successfuly`);
    })
})
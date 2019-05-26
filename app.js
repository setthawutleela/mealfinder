const express = require('express');
const mysql = require('mysql');
const path = require('path');
const upload = require('express-fileupload');
const parser = require('body-parser');
const session = require('express-session');
const app = express();

app.use(parser());
app.use(session({
    secret: 'ssshhhhh',
    resave: false,
    saveUninitialized: false
}))

app.use(express.static(path.join(__dirname, 'public')));
app.use('/admin', express.static(path.join(__dirname, 'public')));
app.use('/customer', express.static(path.join(__dirname, 'public')));


//Create connection
const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'mealfinder2'
});
//Connect database
con.connect((err) => {
    if(err){
        throw err;
    }
    console.log('Mysql is connected...');
});

app.get('/', (req, res) => {
    res.sendFile(__dirname+'/homepage.html')
});

app.get('/signin', (req, res) => {
    res.sendFile(__dirname+'/signin.html')
});

app.get('/signup', (req, res) => {
    res.sendFile(__dirname+'/signup.html')
});

app.get('/admin', (req, res) => {
    res.sendFile(__dirname+'/adminpage.html')
});

app.get('/admin/manage-account', (req, res) => {
    res.sendFile(__dirname+'/manageaccount.html')
});

app.get('/admin/manage-theme', (req, res) => {
    res.sendFile(__dirname+'/managetheme.html')
});

app.get('/report', (req, res) => {
    res.sendFile(__dirname+'/report.html')
});

app.get('/customer/theme-view', (req, res) => {
    res.sendFile(__dirname+'/theme_view.html')
});

<<<<<<< HEAD
app.get('/aboutUs', (req, res) => {
    res.sendFile(__dirname+'/aboutUs.html')

=======
app.get('/admin/manage-restaurant', (req, res) => {
    res.sendFile(__dirname+'/managerestaurant.html')
>>>>>>> 283f3950bcb25d89ac226a01cd3f39357bff9f1b
});


app.post('/signin',(req, res) => {
    console.log('Sign in requested...');
    let sql = `SELECT * FROM user_info WHERE email = '${req.body.email}'`;
    let query = con.query(sql, (err, result) => {
        if(err){ //Query is not success
            console.log(err);
            res.redirect('/signin');
        }
        else{ //Query is success
            if(result.length == 0) {//There is no email
                res.redirect('/signin');
            }
            else {//There is an email
                if(result[0].password == req.body.password) {//Login is valid
                    sess = req.session;
                    sess.email = result[0].email;
                    sess.rank = result[0].rank;
                    sess.fullName = result[0].fullName;
                    if(result[0].rank == 'admin'){
                        res.redirect('/admin');
                    }
            
                    else if(result[0].rank == 'client'){
                        res.redirect('/');
                    }
                }
                else { //Log in is invalid
                    res.redirect('/signin');
                }
            }
        }
    })
});

app.post('/signup',(req, res) => {
    console.log('Sign up requested...');
    var ranking = 'client';
    let sql = `INSERT INTO user_info(email, fullName, password, rank, userPhone, birthDate)
                VALUES('${req.body.email}', '${req.body.fullName}', '${req.body.password}',
                '${ranking}', '${req.body.userPhone}', ${req.body.birthDate})`;
    let query = con.query(sql, (err, result) => {
        if(err){ //Query is not success
            console.log(err);
            res.redirect('/signup');
        }
        else{ //Query is success
            console.log('sign up successfully...');
            const sess = req.session;
            sess.email = req.body.email;
            sess.rank = req.body.rank;
            sess.fullName = req.body.fullName;
            res.redirect('/');
        }
    });
});

app.get('/check-session', (req, res) => {
    sess = req.session
    res.send(JSON.stringify(sess))
})

app.get('/signout', (req, res) => {
    req.session.destroy( (err) => {
        if(err){
            console.log(err)
        }
        else{
            res.redirect('/signin');
        }
    })
})

app.get('/signin',(req, res) => {
    console.log('Sign in requested...');
    let sql = `SELECT * FROM user_info WHERE email = '${req.body.email}'`;
    let query = con.query(sql, (err, result) => {
        if(err){ //Query is not success
            console.log(err);
            res.redirect('/signin');
        }
        else{ //Query is success
            if(result.length == 0) {//There is no email
                res.redirect('/signin');
            }
            else {//There is an email
                if(result[0].password == req.body.password) {//Login is valid
                    sess = req.session;
                    sess.email = result[0].email;
                    sess.rank = result[0].rank;
                    sess.fullName = result[0].fullName;
                    if(result[0].rank == 'admin'){
                        res.redirect('/admin');
                    }
                    else if(result[0].rank == 'client'){
                        res.redirect('/');
                    }
                }
                else { //Log in is invalid
                    res.redirect('/signin');
                }
            }
        }
    })
});

app.get('/admin/get-account', (req, res) => {
    let sql = `SELECT * FROM user_info WHERE 1`;
    let query = con.query(sql, (err, results) => {
        res.send(JSON.stringify(results))
    })
})

app.post('/admin/delete-account', (req, res) => {
    let sql = `DELETE FROM user_info WHERE user_id = ${req.body.user_id}`;
    let query = con.query(sql, (err, results) => {
        res.send('success');
    })
});

app.get('/admin/get-theme', (req, res) => {
    let sql = `SELECT * FROM theme_info WHERE 1`;
    let query = con.query(sql, (err, results) => {
        res.send(JSON.stringify(results))
    })
});

app.post('/admin/delete-theme', (req, res) => {
    let sql = `DELETE FROM theme_info WHERE theme_id = ${req.body.theme_id}`;
    let query = con.query(sql, (err, results) => {
        res.send('success');
    })
});

app.post('/admin/edit-theme', (req, res) => {
    console.log(req.body);
    let sql = `UPDATE theme_info SET themeName = '${req.body.themeName}' WHERE theme_id = '${req.body.theme_id}'`
    let query = con.query(sql, (err, results) => {
        res.send(JSON.stringify(results))
    });
});

app.post('/admin/add-theme', (req, res) => {
    console.log(req.body);
    let sql = `INSERT INTO theme_info(themeName, themeDescription, themeStartDate, themeEndDate, themeViewCount)
                VALUES('${req.body.themeName}', '${req.body.themeDescription}', '${req.body.themeStartDate}',
                '${req.body.themeEndDate}', '${req.body.themeViewCount}')`
    let query = con.query(sql, (err, results) => {
        res.send(JSON.stringify(results))
    });
});

app.post('/report',(req, res) => {
    let sql = `INSERT INTO report(user_ID,reportTitle, reportDescription, reportDate)
                VALUES('${sess.id}','${req.body.reportTitle}','${req.body.reportDescription}',
                '${req.body.reportDate}')`
    let query = con.query(sql ,(err, result) => {
        if(err){
            console.log(err);
            res.redirect('/signin');
        }
        else{
            res.redirect('/');
        }
    });
});

app.get('/customer/get-themeName', (req, res) =>{
    console.log(req.body);
    let sql = `SELECT themeName FROM theme_info WHERE 1`;
    let query = con.query(sql, (err, results) =>{
        res.send(JSON.stringify(results))
    })
})

app.post('/customer/get-themeRestaurant', (req, res) => {
    console.log(req.body);
    let sql = `SELECT  r.restaurantName
    FROM theme_register m, restaurant_info r, theme_info t
    WHERE t.themeName = '${req.body.themeName}' AND r.restaurant_ID = m.restaurant_ID AND t.theme_ID = m.theme_ID `;
    let query = con.query(sql, (err, results) => {
        res.send(JSON.stringify(results))
    })
});

app.get('/admin/get-restaurant', (req, res) => {
    let sql = `SELECT * FROM restaurant_info WHERE 1`;
    let query = con.query(sql, (err, results) => {
        res.send(JSON.stringify(results))
    })
})



const port = 3000;
app.listen(port, () => {
    console.log(`Server started on port ${port}!`)
});


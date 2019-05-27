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
    database: 'mealfinder'
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
    if(!req.session.email){
        res.sendFile(__dirname+'/signin.html')
    }
    res.sendFile(__dirname+'/adminpage.html')
});

app.get('/admin/manage-account', (req, res) => {
    if(!req.session.email){
        res.sendFile(__dirname+'/signin.html')
    }
    res.sendFile(__dirname+'/manageaccount.html')
});

app.get('/admin/manage-theme', (req, res) => {
    if(!req.session.email){
        res.sendFile(__dirname+'/signin.html')
    }
    res.sendFile(__dirname+'/managetheme.html')
});

app.get('/admin/manage-report', (req, res) => {
    if(!req.session.email){
        res.sendFile(__dirname+'/signin.html')
    }
    res.sendFile(__dirname+'/managereport.html')
});

app.get('/admin/manage-restaurant', (req, res) => {
    if(!req.session.email){
        res.sendFile(__dirname+'/signin.html')
    }
    res.sendFile(__dirname+'/managerestaurant.html')
});

app.get('/admin/manage-advertisement', (req, res) => {
    if(!req.session.email){
        res.sendFile(__dirname+'/signin.html')
    }
    res.sendFile(__dirname+'/manageadvertisement.html')
});

app.get('/admin/analysis', (req, res) => {
    if(!req.session.email){
        res.sendFile(__dirname+'/signin.html')
    }
    res.sendFile(__dirname+'/analysis.html')
});

app.get('/customer/theme-view', (req, res) => {
    if(!req.session.email){
        res.sendFile(__dirname+'/signin.html')
    }
    res.sendFile(__dirname+'/theme_view.html')
});

app.get('/customer/blog', (req, res) => {
    if(!req.session.email){
        res.sendFile(__dirname+'/signin.html')
    }
    res.sendFile(__dirname+'/blog.html')
});

app.get('/customer/add-blog', (req, res) => {
    if(!req.session.email){
        res.sendFile(__dirname+'/signin.html')
    }
    res.sendFile(__dirname+'/blogAdd.html')
});

app.get('/customer/restaurant_info', (req, res) => {
    if(!req.session.email){
        res.sendFile(__dirname+'/signin.html')
    }
    res.sendFile(__dirname+'/restaurant_info.html')
});

app.get('/customer/report', (req, res) => {
    res.sendFile(__dirname+'/report.html')
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
                    sess.user_id = result[0].user_id;
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
})

app.get('/admin/get-account', (req, res) => {
    let sql = `SELECT * FROM user_info WHERE 1`;
    let query = con.query(sql, (err, results) => {
        res.send(JSON.stringify(results))
    })
})

app.post('/admin/delete-account', (req, res) => {
    console.log(req.body)
    let sql = `DELETE FROM user_info WHERE user_id = ${req.body.user_id}`;
    let query = con.query(sql, (err, results) => {
        res.send(JSON.stringify(results))
    })
});

app.get('/admin/get-advertisement', (req, res) => {
    let sql = `SELECT * FROM advertisement_info a, company_info c WHERE a.company_ID = c.company_ID`;
    let query = con.query(sql, (err, results) => {
        res.send(JSON.stringify(results))
    })
});

app.post('/admin/delete-theme', (req, res) => {
    console.log(req);
    let sql = `DELETE FROM theme_info WHERE theme_id = ${req.body.theme_id}`;
    let query = con.query(sql, (err, results) => {
        res.send(JSON.stringify(results))
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

app.get('/admin/get-restaurant', (req, res) => {
    let sql = `SELECT * FROM restaurant_info WHERE 1`;
    let query = con.query(sql, (err, results) => {
        res.send(JSON.stringify(results))
    })
})

app.post('/admin/add-restaurant', (req, res) => {
    let sql = `INSERT INTO restaurant_info(restaurantName, restaurantAddress, restaurantPhone,
                openTimeWeekday, openTimeWeekend, closeTime, storeType, restaurantDes, open_ID)
                VALUES('${req.body.restaurantName}', '${req.body.restaurantAddress}', '${req.body.restaurantPhone}',
                '${req.body.openTimeWeekday}', '${req.body.openTimeWeekend}', '${req.body.closeTime}',
                '${req.body.storeType}', '${req.body.restaurantDes}', '${req.body.open_ID}')`
    let query = con.query(sql, (err, results) => {
        res.send(JSON.stringify(results))
    });
});

app.post('/admin/edit-restaurant', (req, res) => {
    console.log(req.body);
    let sql = `UPDATE restaurant_info SET restaurantName = '${req.body.restaurantName}',
                                        restaurantAddress = '${req.body.restaurantAddress}',
                                        restaurantPhone = '${req.body.restaurantPhone}',
                                        openTimeWeekday = '${req.body.openTimeWeekday}',
                                        openTimeWeekend = '${req.body.openTimeWeekend}',
                                        closeTime = '${req.body.closeTime}',
                                        storeType = '${req.body.storeType}',
                                        restaurantDes = '${req.body.restaurantDes}',
                                        open_ID = '${req.body.open_ID}'
                WHERE restaurant_ID = '${req.body.restaurant_ID}'`;

    let query = con.query(sql, (err, results) => {
        res.send(JSON.stringify(results))
    });
});

app.post('/admin/delete-restaurant', (req, res) => {
    let sql = `DELETE FROM restaurant_info WHERE restaurant_ID = ${req.body.restaurant_ID}`;
    let query = con.query(sql, (err, results) => {
        console.log(result);
        res.send(JSON.stringify(results))
    })
});

app.get('/admin/get-report', (req, res) => {
    let sql = `SELECT * FROM report WHERE 1`;
    let query = con.query(sql, (err, results) => {
        res.send(JSON.stringify(results))
    })
});

app.post('/admin/delete-report', (req, res) => {
    let sql = `DELETE FROM report WHERE report_ID = ${req.body.report_ID}`;
    let query = con.query(sql, (err, results) => {
        res.send(JSON.stringify(results))
    })
});

app.post('/admin/analysis', (req, res) => {
    console.log(req.body);
    let sql;
    if(req.body.val == 1){
        sql = `SELECT advertisingName AS 'Advertising Name', DATEDIFF(adEndDate, adStartDate) AS Days 
        FROM advertising_info ORDER BY Days DESC LIMIT 3`;
    }
    else if(req.body.val == 2){
        sql =`SELECT t.themeName AS 'Theme Name', COUNT(t.themeName) AS 'Restaurant Count' 
        FROM theme_info t, restaurant_info r, theme_register tr 
        WHERE tr.theme_ID = t.theme_id AND tr.restaurant_ID = r.restaurant_ID GROUP BY t.themeName ORDER BY 'Restaurant Count' DESC LIMIT 3`;
    }

    else if(req.body.val == 3){
        sql =`SELECT advertiseCategory AS 'Advertise Category', COUNT(advertiseCategory) AS Count 
            FROM advertising_info GROUP BY advertiseCategory ORDER BY Count DESC`;
    }

    else if(req.body.val == 4){
        sql =`SELECT restaurantName AS 'Restaurant Name', viewCount AS 'View Count'
        FROM restaurant_info ORDER BY viewCount DESC LIMIT 3`;
    }

    else if(req.body.val == 5){
        sql =`SELECT c.companyName AS 'Company Name', COUNT(a.company_ID) AS Count 
        FROM advertising_info a, company_info c 
        WHERE a.company_ID = c.company_ID GROUP BY c.companyName ORDER BY Count DESC LIMIT 3`;
    }

    else if(req.body.val == 6){
        sql = `SELECT themeName AS 'Theme Name', themeViewCount AS 'View Count'
        FROM theme_info ORDER BY themeViewCount DESC LIMIT 3`;
    }

    else if(req.body.val == 7){
        sql = `SELECT blogTopic AS 'Blog Topic', blogViewCount AS 'View Count'
        FROM blog ORDER BY blogViewCount DESC LIMIT 3`;
    }

    else if(req.body.val == 8){
        sql = `SELECT hour(reportTime) AS 'Report Time', count(*) AS Count 
        FROM report GROUP BY hour(reportTime) ORDER BY(Count) DESC LIMIT 3`;
    }

    else if(req.body.val == 9){
        sql = `SELECT month(reportDate) AS Month, count(*) AS Count 
        FROM report GROUP BY month(reportDate) ORDER BY(Count) DESC LIMIT 3`;
    }

    else if(req.body.val == 10){
        sql = `SELECT r.restaurantName AS 'Restaurant Name', COUNT(u.restaurant_ID) AS Count
        FROM user_history u, restaurant_info r WHERE u.restaurant_ID = r.restaurant_ID GROUP BY (u.restaurant_ID) ORDER BY (Count) DESC LIMIT 3`;
    }

    else if(req.body.val == 11){
        sql = `SELECT month(historyDate) AS Month, COUNT(*) AS Count
        FROM user_history GROUP BY(month(historyDate)) ORDER BY Count DESC LIMIT 3`;
    }
    
    else if(req.body.val == 12){
        sql = `SELECT p.PaymentWay AS 'Payment Method', COUNT(*) AS Count 
        FROM payment p, payment_register pr, restaurant_info r 
        WHERE p.Payment_ID = pr.payment_ID AND r.restaurant_ID = pr.restaurant_ID GROUP BY p.PaymentWay ORDER BY Count DESC`;
    }


    let query = con.query(sql, (err, results) => {
        console.log(results)
        res.send(JSON.stringify(results))
    })

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

app.get('/admin/get-theme', (req, res) => {
    let sql = `SELECT * FROM theme_info WHERE 1`;
    let query = con.query(sql, (err, results) => {
        res.send(JSON.stringify(results))
    })
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

app.post('/customer/restaurant_info', (req, res) =>{
    let sql = `SELECT restaurant_ID, restaurantName, openTimeWeekday, closeTime FROM restaurant_info WHERE 1`
    console.log(req.body);
    let query = con.query(sql, (err, results) => {
        res.send(JSON.stringify(results))
    })

})

app.post('/customer/get-mealInfo', (req, res) => {
    console.log(req.body);
    let sql = `SELECT  mealName, price
    FROM meal_list
    WHERE restaurant_ID = '${req.body.restaurant_ID}'`;
    let query = con.query(sql, (err, results) => {
        res.send(JSON.stringify(results))
    })
});

app.post('/customer/add-blog',(req, res) => {
    console.log(req.body)
    let sql = `INSERT INTO blog(user_ID,blogTopic, blogDescription, blogDate, blogTime)
                VALUES('${sess.id}','${req.body.blogTopic}','${req.body.blogDescription}',
                '${req.body.blogDate}','${req.body.blogTime}')`
    let query = con.query(sql ,(err, result) => {
        if(err){
            console.log(err);
            res.redirect('/customer/add-blog');
        }
        else{
            res.redirect('/customer/blog');
        }
    });
});

app.post('/customer/get-blogDetail', (req, res) => {
    console.log(req.body);
    let sql = `SELECT  blogDescription
    FROM blog
    WHERE blogTopic = '${req.body.blogTopic}'`;
    let query = con.query(sql, (err, results) => {
        res.send(JSON.stringify(results))
    })
});

app.post('/customer/get-blog', (req, res) => {
    let sql = `SELECT blogTopic FROM blog WHERE 1`;
    console.log(req.body)
    let query = con.query(sql, (err, results) => {
        res.send(JSON.stringify(results))
    })
})

// app.get('/admin/update', (req, res) => {
//     let sql = `UPDATE restaurant_info SET storeType = '${req.body.storeType}' WHERE resturant_ID = ${req.body.restaurant_ID}`;
//     let query = con.query(sql, (err, results) => {
//         res.send(JSON.stringify(results))
//     })
// })



const port = 3000;
app.listen(port, () => {
    console.log(`Server started on port ${port}!`)
});


app.get('/admin/manage-new', (req, res) => {
    if(!req.session.email){
        res.sendFile(__dirname+'/signin.html')
    }
    res.sendFile(__dirname+'/managenew.html')
});

app.get('/admin/get-new', (req, res) => {
    console.log(req.body)
    let sql = `SELECT * FROM news WHERE 1`;
    let query = con.query(sql, (err, results) => {
        res.send(JSON.stringify(results))
    })
});

app.post('/admin/delete-new', (req, res) => {
    let sql = `DELETE FROM news WHERE news_ID = ${req.body.news_ID}`;
    let query = con.query(sql, (err, results) => {
        res.send(JSON.stringify(results))
    })
});

app.post('/admin/edit-news', (req, res) => {
    console.log(req.body);
    let sql = `UPDATE news SET newsDescription = '${req.body.newsDescription}' WHERE news_ID = '${req.body.news_ID}'`
    let query = con.query(sql, (err, results) => {
        res.send(JSON.stringify(results))
    });
});

app.post('/admin/add-news', (req, res) => {
    console.log(req.body);
    let sql = `INSERT INTO news(newsDescription, newsDate, user_ID)
                VALUES('${req.body.newsDescription}', '${req.body.newsDate}', '${req.session.user_id}')`
    let query = con.query(sql, (err, results) => {
        res.send(JSON.stringify(results))
    });
});
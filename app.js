const express = require('express');
const request = require('request');
const https = require('https');
const app = express();

app.use(express.urlencoded({extended:true}));

app.use(express.static("public"));

app.get('/',(req,res)=>{
    res.sendFile(`${__dirname}/signup.html`);
})

app.post('/failure',(req,res)=>{
    res.redirect('/');
})

app.post('/',(req,res)=>{
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    }
    const jsonData = JSON.stringify(data);

    const url = `https://us5.api.mailchimp.com/3.0/lists/6ca5547cc7`;

    const options = {
        method: 'POST',
        auth: "goutham:b5b3289af5b29e1127211e3d034c9e0a-us5"
    }

    const request = https.request(url, options, (response)=>{
        response.on('data',(data)=>{
            console.log(JSON.parse(data));
            if(response.statusCode == 200){
                res.sendFile(`${__dirname}/success.html`);
            }else{
                res.sendFile(`${__dirname}/failure.html`);
            }
        })
    })

    // request.write(jsonData);
    request.end();
})

app.listen(process.env.port || 3000,()=>{
    console.log('Listening on port 3000.');
})

//mailchimp api key b5b3289af5b29e1127211e3d034c9e0a-us5
// list id - 6ca5547cc7
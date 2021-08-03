;
const app = require('./expressApp')
const port = process.env.PORT;


app.listen(port , () =>{
    console.log("listening to port: " , port);
});
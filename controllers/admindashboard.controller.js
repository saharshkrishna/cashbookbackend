const newUser = require("../MongoDb/models/userModels/User");



exports.loginUser = async (req,res) => {
    try{
        const  {name,age}  = req.body;
        const user = new newUser({
            name : name,
            age: age
        });
        user.save();
        res.status(200).json({ message: "User created successfully"});
    }catch(err){
        res.status(500).json({ error: "Something went wrong!!"});
    }
    
}
exports.authorization = async(req,res,next)=>{
    try{
        if(req.user.id === req.params.id||req.user.role === "admin"){
          return next()  
        }else{
            return res.status(203).json({
                message:"you are not authorized to access this resource!"
            })
        }
    }catch(error){
        return res.status(400).json({
            massage: error.message
        })
    }
}
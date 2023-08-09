class productController{

    static display = async(req,res)=>{
        try {
           res.send('hello display')
        } catch (error) {
          console.log(error)  
        }
    }
}





module.exports = productController
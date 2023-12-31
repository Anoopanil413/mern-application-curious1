const InterestModal = require('../models/interests')
const UserModal = require('../models/userSchema')



const getInterests = async(req,res)=>{
    try {
        const interestFields= await InterestModal.find({})
        return res.status(200).json({fileds:interestFields})

    } catch (error) {
        res.status(500).json({error: err.message});
    }
}
const addNewInterests = async(req,res)=>{
    try {
        const userId = req.id
        const newinterest  = req.body.interests
        const InterestField = await InterestModal.findOne({name:newinterest})
        if(!InterestField){
            const newInterestField =await new InterestModal({
                name:newinterest
            }).save()

            // const userUpdate = await UserModal.findByIdAndUpdate(
            //     userId,
            //     { $push: { interests: newInterestField._id } },
            //     { new: true }
            //   ); 
            const allInterestFields = await InterestModal.find({})

               return res.status(200).json({fileds:allInterestFields,message:'Fields Added succesfully'})
            }
           return res.status(409).json({message:"Field already available"})

    } catch (error) {
        res.status(500).json({message:"Ivalid response"})
    }
}

module.exports = {getInterests,addNewInterests}
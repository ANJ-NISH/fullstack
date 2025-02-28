const mongoose=require('mongoose');

const userSchema=mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password:{
        type: String,
        required: true,
    },
    resolution:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Resolution',
        }
    ]
},
    {
        timestamps: true,
    }
);

module.exports=mongoose.model('User',userSchema);
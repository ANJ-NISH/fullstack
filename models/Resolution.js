const mongoose=require('mongoose');

const resolutionSchema=mongoose.Schema(
    {
        user:
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        category:
        {
            type: String,
            required: true,
            enum:[
                'Quit a bad habit',
                'Meditation',
                'Study',
                'Health',
                'Finance',
                'Work',
                'Exercise',
                'Other',
              ],
        },
        description:
        {
            type: String,
            required: true,
        },
        startDate:
        {
            type: Date,
            required: true,
        },
        tracking:[
            {
                date:
                {
                    type: Date,
                    required: true,
                },
                status:
                {
                   type: String,
                   enum: ['YES', 'NO'],
                   required: true,
                },
            },
        ],
    }, {timestamps: true}
)

const Resolution=mongoose.model('Resolution', resolutionSchema);

module.exports=Resolution;
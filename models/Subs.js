import mongoose from "mongoose";

const SubsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Subscription Name is required"],
        trim: true,
        minLength: 3,
        maxLength: 100,
    },
    price: {
        type: Number,
        required: [true, "Price is required"],
        min: [0, "Price must be greater than 0"]
    },
    currency: {
        type: String,
        enum: ["INR", "USD", "EUR"],
        default: "INR"
    },
    frequency: {
        type: String,
        enum: ["daily", "weekly", "monthly", "yearly"],
    },
    category: {
        type: String,
        enum: ["technology", "sports", "political", "news", "entertainment", "finance", "other"],
        required: true,
    },
    paymentMethod: {
        type: String,
        required: [true, "Payment Methods is required"],
        trim: true,
    },
    status: {
        type: String,
        enum: ["active", "expired", "cancelled"],
        default: "active",
    },
    startDate: {
        type: Date,
        required: [true, "Start Date is required"],
        validate: {
            validator: (value) => value <= new Date(),
            message: 'Start Date must be in past',
        }
    },
    renewalDate: {
        type: Date,
        validate: {
            validator: function (value) {
                return  value > this.startDate;
            },
            message: 'Renewal Date must be after Start Date',
        }
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    }
}, {timestamps: true})

// this function executed before saving the document in to collection and performs some pre checks and computations
SubsSchema.pre("save", async function (next) {
    if(!this.renewalDate) {
        const renewalPeriods = {
            daily: 1,
            weekly: 7,
            monthly: 30,
            yearly: 365,
        };
        this.renewalDate = new Date(this.startDate);
        this.renewalDate.setDate(this.renewalDate.getDate() + renewalPeriods[this.frequency]);
    }

    if(this.renewalDate < new Date()) {
        this.status = "expired";
    }

    next();
})


const Subs = new mongoose.model("Subs", SubsSchema);

export default Subs;



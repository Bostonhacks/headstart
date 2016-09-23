var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({
    local            : {
        email        : String,
        password     : String,
        registered   : Boolean
    },
    email: String,
    first_name: String,
    last_name: String,
    graduation: Date,
    major: String,
    shirt_size: String,
    dietary_restrictions: String,
    special_needs: String,
    date_of_birth: Date,
    gender: String,
    phone_number: String,
    school: {
      id: Number,
      name: String
    },
    firstHackathon: Boolean,
    reimbursementSeeking: Boolean,
    reimbursementLocation: String,
    reimbursementAmount: Number,
    additional: String
});

// Hash Generation
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password);
};

// Password validation
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('User', userSchema);
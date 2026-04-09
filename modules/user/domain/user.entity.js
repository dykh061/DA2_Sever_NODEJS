class User {
    constructor(id, username,email,password, phone_number,role) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
        this.phone_number = phone_number;
        this.role = role;
    }
}

module.exports = User;

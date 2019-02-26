
const crypto = require('crypto');


const generateToken = async () => {

    return new Promise( (res, rej) => {
        crypto.randomBytes(48, function(err, buffer) {
            const token = buffer.toString('hex');
           // console.log(token)
            res(token)
        });
    });

}


class Store {

    setClient(client) {
        this.client = client

        this.db = client.db('moonstock')
    }

    DB() {
        return this.db
    }

    async createUser(user) {
        const userColl = this.db.collection('users');

        user['token'] = await generateToken();

        return new Promise((res, rej) => {

            userColl.insert(user, (err, result) => {
            
                if (err) 
                    rej(err)
                console.log(result)
                res(result["ops"][0])
            })
        })
        
    }


    async getUser(token, email) {
        this.client
    }
}

module.exports = Store
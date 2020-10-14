const { v4: uuidv4 } = require('uuid');

let users = [
    {
        userId: uuidv4(),
        username: 'user123',
        name: 'Jon Doe',
        birthDate: '10-10-1990',
        StreetAddress:{
            street: 'Somestreet 12',
            city: 'Oulu',
            postalCode: '90100',
            country: 'Finland'
        },
        password: '$2a$06$YNsJFwPLxFD.xUb6zEG/ZeBuqSt9qQ1s3dC40ZtoXbm58tAlhQXpe', //myPassword
        phone: "000123123",
        email: 'a.a@something.net'
    },
    {
      userId: uuidv4(),
      username: 'user222',
      name: 'Sonny McDonny',
      birthDate: '4-6-1995',
      StreetAddress:{
          street: 'Somestreet 22',
          city: 'Oulu',
          postalCode: '90100',
          country: 'Finland'
      },
      password: '$2a$06$YNsJFwPLxFD.xUb6zEG/ZeBuqSt9qQ1s3dC40ZtoXbm58tAlhQXpe', //myPassword
      phone: "000123333",
      email: 'b.bbb@something.net'
  }

];

module.exports = {

    getAllUsers: () => users,
    getUserId: (username) => foundUser = users.find(u => u.username == username).userId,
    getUserById: (id) => users.find(u => u.userId == id),
    getUserByName: (username) => users.find(u => u.username == username),
    deleteUser: (id) => {
        const user = users.find(u => u.userId == id);
        users.splice(users.findIndex(v => v.username === user.username), 1)
    },
    resetApiKey: (userId) => {
      const user = users.find(u => u.id == userId);
      if(user === undefined)
      {
        return false
      }
  
      user.validApiKey = uuidv4();
      return user.validApiKey;
    },
    getApiKey: (userId) => {
      const user = users.find(u => u.id == userId);
      if(user === undefined)
      {
        return false
      }
  
      return user.validApiKey;
    },
    getUserWithApiKey: (apiKey) => users.find(u => u.validApiKey == apiKey),
    addUser: (username, name, birthDate, StreetAddress, password, phone, email) => {
      users.push({
        userId: uuidv4(),
        username,
        name,
        birthDate,
        StreetAddress,
        password,
        phone,
        email
      });
    } 

}
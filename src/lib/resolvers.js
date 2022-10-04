const {v5, v1} = require('uuid');
const { users, contact, userDocument, typeDocument, country_tb } = require('../data/usersFake');

module.exports = {
    Query: {
        getUsers: ()=>{
            return users
        },
        getDocument: () => {
            return userDocument
        },
        getContact: () => {
            return contact
        }
    },
    Mutation: {
        createUser: async(root, args) => {
            const user = {...args, id: v1()};
            users.push(user)
            return user
        }
    },
    UserDocument: {
        UserID({UserID}){
            return users.find(user => {
                return user.id === UserID
            })
        },
        TypeDocument({TypeDocument}){
            return typeDocument.find(type => type.id === TypeDocument)
        }
    },
    ContactInfo_TB: {
        UserID({UserID}){
            return users.find(user => user.id === UserID)
        },
        CountryID({CountryID}){
            return country_tb.find(country => country.id === CountryID)
        }
    }
}
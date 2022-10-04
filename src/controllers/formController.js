const date = require('date-and-time');
const bcryptjs = require('bcryptjs')
const { users, contact, userDocument, typeDocument, country_tb } = require('../data/usersFake');
const { v1 } = require('uuid');
const jwt = require('jsonwebtoken')

const formulario = (req, res) => {
    const inputField = (name, placeholder, type) => {
        return `<input name='${name}' placeholder='${placeholder}' type='${type}'  required/>`
    }
    res.send(`
    <h1>Register</h1>
    <form method='post' action='/'>
        <label>Information Basic</label>
        ${inputField('Name', 'Name', '')}
        ${inputField('LastName', 'Lastname', '')}
        ${inputField('username', 'Username', '')}
        ${inputField('email', 'Email', 'email')}
        ${inputField('emailVerify', 'Email Verified', 'email')}
        ${inputField('password', 'Password', 'password')}
        ${inputField('isMilitar', 'You are militar? Y or N', '')}
        ${inputField('isTemporal', 'Is temporal? Y or N', '')}
        <label>Document</label>
        ${inputField('NameTypeDocument', 'Document type', '')}
        ${inputField('Document', 'Document', '')}
        ${inputField('PlaceExpedition', 'Place Expedition', '')}
        ${inputField('DateExpedition', 'Date Expedition', 'date')}
        <label>Contact Info</label>
        ${inputField('CountryName', 'Country', '')}
        ${inputField('CountryCode', 'CountryCode', 'number')}
        ${inputField('Address', 'Address', '')}
        ${inputField('City', 'City', '')}
        ${inputField('Phone', 'Phone', '')}
        ${inputField('CelPhone', 'Celphone', '')}
        ${inputField('EmergencyName', 'Emergency Name', '')}
        ${inputField('EmergencyPhone', 'EmergencyPhone', '')}
        <input type='submit' value='Register' />
    </form>
    `)
}

const postUser = (req, res, next) => {
    var {Name, LastName, username, email, emailVerify, password, isMilitar, isTemporal, NameTypeDocument, Document, PlaceExpedition, DateExpedition, CountryCode, CountryName, Address, City, Phone, CelPhone, EmergencyName, EmergencyPhone} = req.body

    
//  Token 
    let verificationToken = jwt.sign({email}, 'secretkey', {expiresIn: '48h'})

//  Validaciones;
    let militar = false, temporal = false

    const emailExist = users.find(user => user.email === email);
    
    if(emailExist)return res.status(404).json({message: 'The email already exists'})

    if(LastName.length > 20 || 
        Name.length > 20 || City.length > 50 && City.length < 4 || 
        Document.length > 20 && Document.length < 8 ||
        PlaceExpedition.length > 60 || 
        CelPhone.length > 20 || Phone.length > 20 ||
        CountryCode.length > 4 || CountryName.length > 100 ||
        EmergencyName.length > 100 || EmergencyPhone.length > 20
    )return res.status(404).json({message: 'A field exceeded the number of characters allowed'})

    if(email !== emailVerify)return res.status(404).json({message: 'The emails do not match'})

    isMilitar = isMilitar.toUpperCase();
    isTemporal = isTemporal.toUpperCase();
    if(isMilitar === 'Y')militar = true;
    if(isMilitar === 'N')militar = false;
    if(isTemporal === 'Y')temporal = true;
    if(isTemporal === 'N')temporal = false;
    isMilitar = militar
    isTemporal = temporal
    console.log(isMilitar)

//  Hasheo password
    let passHash = bcryptjs.hashSync(password, 8);

//  Establezco los distintos ID para las relaciones
    const userId = v1();
    const typeId = v1();
    const countryId = v1();

//  Establezco la fecha de creación
    const timeCreate = new Date()

//  Establezo la tabla ContactInfo_TB
    const newContact = {
        id: v1(),
        UserID: userId,
        Address,
        CountryID: countryId,
        City,
        Phone,
        CelPhone,
        EmergencyName,
        EmergencyPhone
    }
    const newCountry = {
        id: countryId,
        CountryCode,
        CountryName
    }

//  Establezco la tabla UserDocument_TB
    const newDocument = {
        UserID: userId,
        Document,
        TypeDocumentID: typeId,
        PlaceExpedition,
        DateExpedition,
    }
    const newTypeDocument = {
        id: typeId,
        NameTypeDocument
    }
    

//  Creo el usuario
    const newUser = {
        id: userId, 
        TimeCreate: date.format(timeCreate, 'YYYY/MM/DD HH:mm:ss'),
        Name,
        LastName,
        username,
        isMilitar,
        isTemporal,
        email,
        emailVerify,
        password: passHash,
        verificationToken
    }

//  Hago push a los objetos anteriormente creados
    contact.push(newContact);
    userDocument.push(newDocument);
    typeDocument.push(newTypeDocument);
    country_tb.push(newCountry);
    users.push(newUser)
    res.json(newUser)
}

module.exports = {
    formulario, 
    postUser,
}
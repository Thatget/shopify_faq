module.exports = {
    HOST: "localhost",
    USER: "dev_newuser",
    PASSWORD: "dev_password",
    DB: "dev_faq_app",
    dialect: "mysql",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};

// module.exports = {
//     HOST: "localhost",
//     USER: "root",
//     PASSWORD: "Matkhau1",
//     DB: "mydb",
//     dialect: "mysql",
//     pool: {
//         max: 5,
//         min: 0,
//         acquire: 30000,
//         idle: 10000
//     }
// };

module.exports = {
  test: {
    database: {
      name: "rapido_test",
      options: {
        dialect: "sqlite",
        storage: "./db/db.test.sqlite"
      }
    }
  },
  development: {
    database: {
      name: "rapido_development",
      options: {
        dialect: "sqlite",
        storage: "./db/db.development.sqlite"
      }
    }
  },
  production: {
    database: {
      name: "rapido_production",
      username: "rapido",
      password: "blastoiseisawesome",
      options: {
        host: "localhost",
        dialect: "postgres",
        pool: {
          "max": 5,
          "min": 0,
          "idle": 10000
        }
      }
    }
  }
}

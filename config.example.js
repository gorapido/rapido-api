module.exports = {
  test: {
    database: {
      name: "rapido_test",
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
  },
  development: {
    database: {
      name: "rapido_development",
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

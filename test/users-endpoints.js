const app = require("../src/app");
const bcrypt = require("bcryptjs");
const helpers = require("./test-helpers");
const knex = require("knex");
const moment = require("moment");

describe("Users Endpoints", function () {
  let db;

  const { testUsers } = helpers.makeFixtures();
  const testUser = testUsers[0];

  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set("db", db);
  });

  after("disconnect from db", () => db.destroy());

  before("cleanup", () => helpers.cleanTables(db));

  afterEach("cleanup", () => helpers.cleanTables(db));

  describe(`GET /api/users`, () => {
    context("Given there are users in the database", () => {
      beforeEach("insert users", () => helpers.seedUsers(db, testUsers));

      it("responds with 200 and the user", () => {
        const expectedUsers = testUsers.map((user) =>
          helpers.makeExpectedUser(user)
        );
        return supertest(app)
          .get("/api/users")
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .expect(200, expectedUsers[0]);
      });
    });
  });

  describe(`POST /api/users`, () => {
    context(`User Validation`, () => {
      beforeEach("insert users", () => helpers.seedUsers(db, testUsers));

      const requiredFields = ["email", "password", "full_name", "deactivated"];

      requiredFields.forEach((field) => {
        const registerAttemptBody = {
          full_name: "test full_name",
          email: "test email",
          password: "test password",
          deactivated: "false",
        };

        it(`responds with 400 required error when '${field}' is missing`, () => {
          delete registerAttemptBody[field];

          return supertest(app)
            .post("/api/users")
            .send(registerAttemptBody)
            .expect(400, { error: `Missing '${field}' in request body` });
        });

        it(`responds 400 'Password must be longer than 8 characters' when empty password`, () => {
          const userShortPassword = {
            full_name: "test full_name",
            email: "test email",
            password: "1234567",
            deactivated: "false",
          };

          return supertest(app)
            .post("/api/users")
            .send(userShortPassword)
            .expect(400, {
              error: `Password must be longer than 8 characters`,
            });
        });

        it(`responds 400 'Password must be less than 72 characters' when long password`, () => {
          const userLongPassword = {
            full_name: "test full_name",
            email: "test email",
            password: "*".repeat(73),
            deactivated: "false",
          };

          return supertest(app)
            .post("/api/users")
            .send(userLongPassword)
            .expect(400, { error: `Password must be less than 72 characters` });
        });

        it(`responds 400 error when password starts with spaces`, () => {
          const userPasswordStartsSpaces = {
            full_name: "test full_name",
            email: "test email",
            password: " 1Aa!2Bb@",
            deactivated: "false",
          };

          return supertest(app)
            .post("/api/users")
            .send(userPasswordStartsSpaces)
            .expect(400, {
              error: `Password must not start or end with empty spaces`,
            });
        });

        it(`responds 400 error when password ends with spaces`, () => {
          const userPasswordEndsSpaces = {
            full_name: "test full_name",
            email: "test email",
            password: "1Aa!2Bb@ ",
            deactivated: "false",
          };

          return supertest(app)
            .post("/api/users")
            .send(userPasswordEndsSpaces)
            .expect(400, {
              error: `Password must not start or end with empty spaces`,
            });
        });

        it(`responds 400 error when password isn't complex enough`, () => {
          const userPasswordNotComplex = {
            full_name: "test full_name",
            email: "test email",
            password: "11AAaabb",
            deactivated: "false",
          };

          return supertest(app)
            .post("/api/users")
            .send(userPasswordNotComplex)
            .expect(400, {
              error: `Password must contain 1 upper case, lower case, number and special character`,
            });
        });

        it(`responds 400 'Email already taken' when email isn't unique`, () => {
          const duplicateUser = {
            email: testUser.email,
            password: "11AAaa!!",
            full_name: "test full_name",
            deactivated: "false",
          };

          return supertest(app)
            .post("/api/users")
            .send(duplicateUser)
            .expect(400, { error: `Email already taken` });
        });
      });

      context(`Happy path`, () => {
        it(`responds 201, serialized user, storing bcryped password`, () => {
          const newUser = {
            email: "test email",
            password: "11AAaa!!",
            full_name: "test full_name",
            deactivated: "false",
          };
          return supertest(app)
            .post("/api/users")
            .send(newUser)
            .expect(201)
            .expect((res) => {
              expect(res.body).to.have.property("id");
              expect(res.body.email).to.eql(newUser.email);
              expect(res.body.full_name).to.eql(newUser.full_name);
              expect(res.body.deactivated).to.eql(newUser.deactivated);
              expect(res.body).to.not.have.property("password");
              expect(res.headers.location).to.eql(`/api/users/${res.body.id}`);
              const expectedDate = moment(new Date()).format("ddd MMM DD YYYY");
              const actualDate = moment(new Date(res.body.date_created)).format(
                "ddd MMM DD YYYY"
              );
              expect(actualDate).to.eql(expectedDate);
            })
            .expect((res) =>
              db
                .from("users")
                .select("*")
                .where({ id: res.body.id })
                .first()
                .then((row) => {
                  expect(row.email).to.eql(newUser.email);
                  expect(row.full_name).to.eql(newUser.full_name);
                  expect(row.deactivated).to.eql(newUser.deactivated);
                  const expectedDate = moment(new Date()).format(
                    "ddd MMM DD YYYY"
                  );
                  const actualDate = moment(
                    new Date(res.body.date_created)
                  ).format("ddd MMM DD YYYY");
                  expect(actualDate).to.eql(expectedDate);

                  return bcrypt.compare(newUser.password, row.password);
                })
                .then((compareMatch) => {
                  expect(compareMatch).to.be.true;
                })
            );
        });
      });
    });
  });

  describe(`PATCH /api/users`, () => {
    context("Given there are users in the database", () => {
      beforeEach("insert users", () => helpers.seedUsers(db, testUsers));

      const requiredFields = ["password", "deactivated"];

      requiredFields.forEach((field) => {
        const registerAttemptBody = {
          password: "Password123!",
          deactivated: "false",
          ...testUser,
        };

        it(`responds with 400 required error when '${field}' is missing`, () => {
          delete registerAttemptBody[field];

          return supertest(app)
            .patch(`/api/users`)
            .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
            .send(registerAttemptBody)
            .expect(400, { error: `Missing '${field}' in request body` });
        });
      });

      it(`responds 400 'Password must be longer than 8 characters' when empty password`, () => {
        const userShortPassword = {
          password: "1234567",
          deactivated: "false",
        };

        return supertest(app)
          .patch(`/api/users`)
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .send(userShortPassword)
          .expect(400, { error: `Password must be longer than 8 characters` });
      });

      it(`responds 400 'Password must be less than 72 characters' when long password`, () => {
        const userLongPassword = {
          password: "*".repeat(73),
          deactivated: "false",
        };

        return supertest(app)
          .patch(`/api/users`)
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .send(userLongPassword)
          .expect(400, { error: `Password must be less than 72 characters` });
      });

      it(`responds 400 error when password starts with spaces`, () => {
        const userPasswordStartsSpaces = {
          password: " 1Aa!2Bb@",
          deactivated: "false",
        };

        return supertest(app)
          .patch(`/api/users`)
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .send(userPasswordStartsSpaces)
          .expect(400, {
            error: `Password must not start or end with empty spaces`,
          });
      });

      it(`responds 400 error when password ends with spaces`, () => {
        const userPasswordEndsSpaces = {
          password: "1Aa!2Bb@ ",
          deactivated: "false",
        };

        return supertest(app)
          .patch(`/api/users`)
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .send(userPasswordEndsSpaces)
          .expect(400, {
            error: `Password must not start or end with empty spaces`,
          });
      });

      it(`responds 400 error when password isn't complex enough`, () => {
        const userPasswordNotComplex = {
          password: "11AAaabb",
          deactivated: "false",
        };

        return supertest(app)
          .patch(`/api/users`)
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .send(userPasswordNotComplex)
          .expect(400, {
            error: `Password must contain 1 upper case, lower case, number and special character`,
          });
      });

      it("responds with 204 and updates the user", () => {
        const updatedUser = {
          password: "Password123!",
          deactivated: "false",
          ...testUser,
        };

        return supertest(app)
          .patch(`/api/users`)
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .send(updatedUser)
          .expect(204);
      });

      it(`responds with 204 when updating only a subset of fields`, () => {
        const updatedUser = {
          deactivated: "true",
          ...testUser,
        };

        return supertest(app)
          .patch(`/api/users`)
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .send({
            ...updatedUser,
            fieldToIgnore: "should not be in GET response",
          })
          .expect(204);
      });
    });
  });
});

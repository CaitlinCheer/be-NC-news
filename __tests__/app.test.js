const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const {
  articleData,
  commentData,
  topicData,
  userData,
} = require("../db/data/test-data/index");
const endpoints = require("../endpoints.json");

beforeEach(() => seed({ articleData, commentData, topicData, userData }));
afterAll(() => db.end());

describe("/api", () => {
  it("GET: 200 returns an object  ", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual(endpoints);
      });
  });
});

describe("/api/topics", () => {
  it("GET: 200 responds with an array of all topics to the client", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body: { rows } }) => {
        expect(Array.isArray(rows)).toBe(true);
      });
  });
  it("GET: should return objects within the array in the correct format", () => {
    return request(app)
      .get("/api/topics")
      .then(({ body: { rows } }) => {
        rows.forEach((topic) => {
          expect(topic).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
});
describe("/api/articles", () => {
  it("GET: 200 should respond with an array containing the article data", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        articles.forEach((article) => {
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(String),
          });
        });
      });
  });
  it("Should be in order DESC by date", () => {
    return request(app)
      .get("/api/articles")
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("created_at", {
          coerce: true,
          descending: true,
        });
      });
  });
  it("Should be able to sort by any of the allowed values: title, topic, author, body, article_img_url", () => {
    return request(app)
      .get("/api/articles?sort_by=title")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("title", {
          coerce: true,
          descending: true,
        });
      });
  });
  it("Should be allowed to be ordered by either DESC or ASC", () => {
    return request(app)
      .get("/api/articles?sort_by=title&order=asc")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("title", {
          coerce: true,
          ascending: true,
        });
      });
  });
  it("400: When an incorrect value is input, returns an error", () => {
    return request(app)
      .get("/api/articles?sort_by=invalid")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("incorrect input");
      });
  });
});
describe("/api/articles/article_id", () => {
  it("GET: 200 responds with appropriate article", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toEqual({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 100,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  it("Responds with a 400 error when input a wrong type", () => {
    return request(app)
      .get("/api/articles/incorrect")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("incorrect input");
      });
  });
  it("Responds with a 404 error message when a value is passed but not found", () => {
    return request(app)
      .get("/api/articles/1000")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("article not found");
      });
  });
});
describe("GET:/api/articles/:article_id/comments", () => {
  it("200 Should return an array of all comments for the corresponding article when input an id", () => {
    return request(app)
      .get("/api/articles/6/comments")
      .expect(200)
      .then(({ body: { articleComments } }) => {
        expect(articleComments).toEqual([
          {
            comment_id: 16,
            votes: 1,
            created_at: "2020-10-11T15:23:00.000Z",
            author: "butter_bridge",
            body: "This is a bad article name",
            article_id: 6,
          },
        ]);
      });
  });
  it("Each comment should include the given properties in ASC order(asc by created_at): comment_id, voted, created_at, author, body, article_id", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body: { articleComments } }) => {
        articleComments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            article_id: expect.any(Number),
          });
        });
      });
  });

  it("400: If input an incorrect id value should respond with the correct error message", () => {
    return request(app)
      .get("/api/articles/incorrect/comments")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("incorrect input");
      });
  });
  it("404: When a correct value is entered, but nothing is returned should return the correct error message", () => {
    return request(app)
      .get("/api/articles/30/comments")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("No comments avaliable");
      });
  });
});
describe("POST:/api/articles/:article_id/comments", () => {
  it("201: Should post a username and a body to a given article id when the id already exists", () => {
    const item = { username: "butter_bridge", body: "Body" };
    return request(app)
      .post("/api/articles/1/comments")
      .send(item)
      .expect(201)
      .then(({ body: postedComment }) => {
        expect(postedComment.author).toBe("butter_bridge");
        expect(postedComment.body).toBe("Body");
      });
  });
  it("404: Returns correct error when the article_id doesn't exist", () => {
    const item = { username: "butter_bridge", body: "BodyTwo" };
    return request(app)
      .post("/api/articles/100/comments")
      .send(item)
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("ID not found");
      });
  });
  it("400: Returns correct error message when an incorrect value is input", () => {
    const item = { username: "butter_bridge", body: "BodyTwo" };
    return request(app)
      .post("/api/articles/incorrect/comments")
      .send(item)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("incorrect input");
      });
  });
  it("400: When missing one or more keys should return correct error message", () => {
    const item = { username: "butter_bridge" };
    return request(app)
      .post("/api/articles/1/comments")
      .send(item)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid input");
      });
  });
  it("404: Responds with an error message when the username doesn't exist", () => {
    const item = { username: "Invalid", body: "hello there" };
    return request(app)
      .post("/api/articles/1/comments")
      .send(item)
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Name doesn't exist in database");
      });
  });
});
describe("PATCH:/api/articles/:article_id", () => {
  it("200: Should be able to patch an already existing article via article_id", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: 10 })
      .expect(200)
      .then(({ body: patchedArticle }) => {
        expect(patchedArticle.votes).toBe(110);
      });
  });

  it("400: Returns an error when an incorrect input is sent", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: "incorrect" })
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid input");
      });
  });
  it("400: Returns error when an incorrect key is sent", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ incorrect: 10 })
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid input");
      });
  });
});
describe("DELETE:/api/comments/:comment_id", () => {
  it("204: When input an id should delete the given comment and return empty", () => {
    return request(app).delete("/api/comments/1").expect(204);
  });
  it("400: Returns correct error when an invalid id is input", () => {
    return request(app)
      .delete("/api/comments/invalid")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("incorrect input");
      });
  });
  it("404: Should return corrcet error when a comment is not found", () => {
    return request(app)
      .delete("/api/comments/100")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Comment was not found");
      });
  });
});
describe("GET:/api/users", () => {
  it("200: Should return an array consisting of all users containing the following properties: username, name, avatar_url", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body: { allUsers } }) => {
        allUsers.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
});

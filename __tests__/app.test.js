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
describe("/api/articles/:article_id/comments", () => {
  it("GET: 200 Should return an array of all comments for the corresponding article when input an id", () => {
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

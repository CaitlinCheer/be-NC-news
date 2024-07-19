# Northcoders News API

Instruction to clone locally:

1- Create two new .env files, one for test and one for development
2- Add a PGDATABASE to each file
3- Add the correct database name to each, the names can be found in the setup.sql file
4- Make sure that the git ignore is set to all, it will look like this: node_modules .env.\*

Downloading dependencies: npm install

Seeding DATABASE: npm runseed

Running tests: npm test

Link to hosted: https://be-nc-news-74y2.onrender.com


Minimum versions needed to run this file:

Node.js: 14.x
PostgreSQL: 12.x

Understanding this project:

This is an api built with express, node.js and prosgreSQL.
Designed for users, giving them the options to GET, POST, DELETE and PATCH articles, comments and topics.

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)

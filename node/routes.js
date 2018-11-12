var app      = require("../server.js");
var db       = require("../lib/db.js");
var entities = require("html-entities").XmlEntities;
var fs       = require("fs");

app.post("/add-person", function(req, res){
  res.json({"a": "b"});
});

app.get("/", function(req, res){
  var sql = `
  SELECT ??, ??, p.* FROM topics t
  JOIN members m ON m.member_id = t.starter_id
  JOIN posts p ON p.topic_id = t.tid
  LIMIT 2
  `;
  var args = [
    ["t.tid", "t.title", "t.state", "t.starter_id", "t.start_date", "t.views", "t.forum_id", "t.pinned"],
    ["m.name"]
  ];

  /*
    Title
    Date Created
    Post Count
    Last Poster Name
    Last Poster Avatar
    Last Poster Date
  */

SELECT * FROM (
    SELECT t.*, m.name FROM (
        SELECT tid, starter_id
        FROM topics
        ORDER BY tid DESC
        LIMIT 3
    ) AS t
    JOIN members m ON m.member_id = t.starter_id
) AS t

SELECT * FROM (
    SELECT t.*, m.members_display_name AS creatorName, m.member_group_id AS creatorAuthorGroupId FROM (
        SELECT tid AS threadId, start_date AS threadStartDate, title, starter_id AS creatorId
        FROM topics
        ORDER BY tid DESC
        LIMIT 3
    ) AS t
    JOIN members m ON m.member_id = t.creatorId
) AS t

SELECT b.recentPostId, p.author_id AS recentAuthorId,
FROM posts p
INNER JOIN (
    SELECT MAX(pid) recentPostId
    FROM posts
    GROUP BY topic_id
) b ON b.recentPostId = p.pid
ORDER BY topic_id DESC;

SELECT MAX(pid) as recentPostId, topic_id AS threadId, author_id AS recentAuthorId, post_date AS recentPostDate, m.name AS recentAuthorName, m.member_group_id AS recentAuthorGroupId
FROM posts p
JOIN members m ON m.member_id = p.author_id
GROUP BY topic_id
ORDER BY threadId DESC;

  db.query(sql, args, function(err, rows){
    console.log(err);
    console.log(rows);

    var title      = rows[0]["title"];
    var starter_id = rows[0]["name"];

    res.render("index.ejs", {
      "title"     : entities.decode(title),
      "starter_id": starter_id
    });
  });
});

app.use(function (req, res){
  res.render("404.ejs");
});

/*
  tid                  | 10654
  title                | hi!!!!!!!!!
  state                | open
  starter_id           | 636
  start_date           | 1452396101
  views                | 838
  forum_id             | 13
  pinned               | 0
*/

/*
  member_id                 | 2
  name                      | TundraFizz
  email                     | "me@tundrafizz.com"
  joined                    | 1165878000
  ip_address                | "127.0.0.1"
  title                     | "Munchy the Munchlax"
  posts                     | 2748
  bday_day                  | 01
  bday_month                | 01
  bday_year                 | 0001
  last_visit                | 1414645595
  last_activity             | 1415229815
  members_profile_views     | 7422
  member_banned             | 0
*/

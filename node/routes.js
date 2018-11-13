var app      = require("../server.js");
var db       = require("../lib/db.js");
var entities = require("html-entities").XmlEntities;
var fs       = require("fs");

app.post("/add-person", function(req, res){
  res.json({"a": "b"});
});

app.get("/", function(req, res){
  var sql = `
  SELECT z.* FROM (
    SELECT
    t.threadId, t.threadTitle, t.threadStartDate,
    p1.threadPostCount,
    t.threadAuthorId, m1.threadAuthorGroupId, m1.threadAuthorName,
    p1.postAuthorPostId, p2.postAuthorId, m2.postAuthorGroupId, m2.postAuthorName
    FROM (
      SELECT tid AS threadId, title AS threadTitle, starter_id AS threadAuthorId, start_date AS threadStartDate
      FROM topics
      ORDER BY threadId
      DESC LIMIT 3
    ) AS t
    JOIN (
      SELECT COUNT(pid) AS threadPostCount, topic_id AS threadId, MAX(pid) AS postAuthorPostId
      FROM posts
      GROUP BY threadId
    ) AS p1
    ON t.threadId = p1.threadId
    JOIN (
      SELECT pid AS postId, author_id AS postAuthorId
      FROM posts
    ) AS p2
    ON p1.postAuthorPostId = p2.postId
    JOIN (
      SELECT member_group_id AS threadAuthorGroupId, members_display_name AS threadAuthorName, member_id
      FROM members
    ) AS m1
    ON m1.member_id = t.threadAuthorId
    JOIN (
      SELECT member_group_id AS postAuthorGroupId, members_display_name AS postAuthorName, member_id
      FROM members
    ) AS m2
    ON m2.member_id = p2.postAuthorId
  ) AS z;
  `;

  db.query(sql, function(err, rows){
    for(var i in rows){
      var threadId            = rows[i]["threadId"];
      var threadTitle         = rows[i]["threadTitle"];
      var threadStartDate     = rows[i]["threadStartDate"];
      var threadPostCount     = rows[i]["threadPostCount"];
      var threadAuthorId      = rows[i]["threadAuthorId"];
      var threadAuthorGroupId = rows[i]["threadAuthorGroupId"];
      var threadAuthorName    = rows[i]["threadAuthorName"];
      var postAuthorPostId    = rows[i]["postAuthorPostId"];
      var postAuthorId        = rows[i]["postAuthorId"];
      var postAuthorGroupId   = rows[i]["postAuthorGroupId"];
      var postAuthorName      = rows[i]["postAuthorName"];
      console.log(rows[i]);
    }

    res.render("index.ejs", {
      "title"     : entities.decode(threadTitle),
      "starter_id": threadAuthorId
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

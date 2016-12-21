CREATE VIEW events_fts AS
  SELECT
    events.*,
    setweight(to_tsvector('simple', events.title), 'A') ||
    setweight(to_tsvector('simple', events.description), 'B') ||
    setweight(to_tsvector(coalesce(string_agg(comments.text, ' '), '')), 'D') AS document
  FROM events
    LEFT JOIN comments ON events.id = comments."EventId"
  GROUP BY events.id
  ORDER BY "dateStart" ASC;

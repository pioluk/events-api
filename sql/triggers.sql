CREATE OR REPLACE FUNCTION make_geography() RETURNS TRIGGER AS $body$
BEGIN
  UPDATE places SET the_geog = ST_MakePoint(NEW.lat, NEW.lng)::GEOGRAPHY WHERE id = NEW.id;
END;
$body$ LANGUAGE plpgsql;

CREATE TRIGGER set_place_geography
  AFTER INSERT ON places
  FOR EACH ROW
  EXECUTE PROCEDURE make_geography();
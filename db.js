const pg = require("pg");
const client = new pg.Client("postgres://localhost/the_acme_pets_club");

client.connect();

const seeder = async () => {
  const SQL = `
    DROP TABLE IF EXISTS pets;
    DROP TABLE IF EXISTS members;
    CREATE TABLE members(
        id SERIAL PRIMARY KEY,
        name VARCHAR(100)
    );
    
    CREATE TABLE pets(
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        onwer_id INTEGER REFERENCES members(id)
    );
    
    INSERT INTO members(name) VALUES('Moe');
    INSERT INTO members(name) VALUES('Larry');
    INSERT INTO members(name) VALUES('Lucy');
    INSERT INTO members(name) VALUES('Ethyl');
    
    INSERT INTO pets(name, onwer_id) VALUES(
        'Rex', 
        (SELECT id FROM members WHERE name = 'Ethyl')
    );
    INSERT INTO pets(name, onwer_id) VALUES(
        'Fido',
        (SELECT id FROM members WHERE name = 'Ethyl')
    );
    `;
  await client.query(SQL);
  console.log("data is seeded");
};

module.exports = {
    client, 
    seeder
}
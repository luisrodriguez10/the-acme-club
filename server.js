const express = require("express");
const {client, seeder} = require('./db')
const app = express();

app.use(express.static('assets'));

app.get('/', async (req, res, next) => {
    try {
        const SQL = 'SELECT * FROM members;'
        const response = await client.query(SQL);
        const members = response.rows;
        res.send(`
            <html>
                <head>
                    <title>The Acme Club</title>
                    <link rel='stylesheet' href='/styles.css'/>
                </head>
                <body>
                    <h1>The Acme Pets Club</h1>
                    <ul>
                    ${members.map(member => `
                        <li><a href='/members/${member.id}/pets'>${member.name}</a></li>
                    `).join('')}
                    </ul>
                </body>
            </html>
        `)
    } catch (ex) {
        next(ex)
    }
})

app.get('/members/:id/pets', async (req, res, next) => {
    try {
        const memberId = req.params.id;
        const SQL = `
            SELECT pets.name as pet_name, members.name as owner_name
            FROM pets
            RIGHT JOIN members
            ON members.id = pets.onwer_id
            WHERE members.id = $1;
        `;
        const response = await client.query(SQL, [memberId]);
        const results = response.rows;
        res.send(`
            <html>
                <head>
                    <title>The Acme Club</title>
                    <link rel='stylesheet' href='/styles.css'/>
                </head>
                <body>
                    <h1>The Acme Pets Club</h1>
                    <a href='/'>Back to Main Page</a>
                    <ul>
                    ${results.map(result => `
                        <li>${result.owner_name} owns ${result.pet_name}</li>
                    `).join('')}
                    </ul>
                </body>
            </html>
        `)
    } catch (ex) {
        next(ex)
    }
})

const init = async () => {
  try {
    await seeder();
    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`listening on port ${port}`));
  } catch (ex) {
    console.log(ex);
  }
};

init();

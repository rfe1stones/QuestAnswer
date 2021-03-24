const express = require('express');
const bodyParser = require('body-parser');
const { Client } = require('pg');

const port = 3000;
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const client = new Client({
  user: 'questions',
  host: 'localhost',
  database: 'questions',
  password: 'questions',
  port: 5432
});

client.connect();

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`)
});

// app.use(function (err, req, res, next) {
//   console.error(err.stack)
//   res.status(500).send('Something broke!')
// })

app.get('/', (req, res) => {
  // req.query
  console.log(req.query);
  res.send('Hello World!');
});

app.get('/questions', (req, res) => {
  console.log("GET questions");
  // req.query.product_id
  // NOTE: should not include reported questions
  client.query('SELECT * FROM questions WHERE reported = False LIMIT 10', (err, data) => {
    console.log('Client Query: ', err, typeof data);
    if (err) {
      console.log(err);
      res.status(500).end();
    } else {
      res.status(200).json(data.rows).end();
    }
    // client.end();
    // res.end(JSON.stringify(data));
  });
  // console.log(dbGet);
});

app.get('/questions/:productId/answers', (req, res) => {
  console.log("GET questions/product/answers");
  // console.log(req.params.productId);
  // NOTE: should not include reported answers
  client.query(`SELECT * FROM answers WHERE question_id = ${req.params.productId} AND reported = False`, (err, data) => {
    if (err) { return console.log(err); }
    res.status(200).json(data.rows).end();
  });
  // res.end('Finished!');
});

app.post('/questions', (req, res) => {
  // console.log(req.body);
  // body: body, name, email, product_id
  // question_id, product_id, question_body, asker_name, asker_email,
  // Can be left blank: question_date, question_helpfulness, reported
  let {body, name, email, product_id} = req.body;
  let queryString = 'INSERT INTO questions (product_id, question_body, asker_name, asker_email) ';
  let valuesString = `VALUES (${product_id}, '${body}', '${name}', '${email}');`;

  client.query(queryString + valuesString, (err, response) => {
    if (err) { return console.log(err); }
    res.status(202).end('CREATED');
  });
  // res.end('Error');
});

app.post('/questions/:question_id/answers', (req, res) => {
  let {body, name, email} = req.body;
  let {question_id} = req.params;
  let queryString = 'INSERT INTO answers (question_id, body, answerer_name, answerer_email) ';
  let valuesString = `VALUES (${question_id}, '${body}', '${name}', '${email}');`;

  client.query(queryString + valuesString, (err, response) => {
    if (err) { return console.log(err); }
    res.status(201).end('CREATED');
  });
  // res.end('Error');
});

app.put('/questions/:question_id/helpful', (req, res) => {
  console.log(req.params.question_id);
  let queryString =
    `UPDATE questions \
    SET question_helpfulness = question_helpfulness + 1 \
    WHERE question_id = ${req.params.question_id};`;

  client.query(queryString, (err, response) => {
    console.log('query callback for PUT helpful, running')
    if (err) { return console.log(err); }
    res.status(204).end('NO CONTENT');
  });
  // res.end('Error');
});

app.put('/questions/:question_id/report', (req, res) => {
  let queryString =
    `UPDATE questions \
    SET reported = NOT reported \
    WHERE question_id = ${req.params.question_id};`;

  client.query(queryString, (err, response) => {
    if (err) { return console.log(err); }
    res.status(204).end('NO CONTENT');
  });
});

app.put('/answers/:answer_id/helpful', (req, res) => {
  let queryString =
    `UPDATE answers \
    SET helpful = helpful + 1 \
    WHERE id = ${req.params.answer_id};`;

  client.query(queryString, (err, response) => {
    if (err) { return console.log(err); }
    res.status(204).end('NO CONTENT');
  });
});

app.put('/answers/:answer_id/report', (req, res) => {
  let queryString =
    `UPDATE answers \
    SET reported = NOT reported \
    WHERE id = ${req.params.answer_id};`;

  client.query(queryString, (err, response) => {
    if (err) { return console.log(err); }
    res.status(204).end('NO CONTENT');
  });
});



/************* Q&A request routes from FEC ***************/
// app.get('/questions'
// app.get('/questions/:productId/answers'
// app.post('/questions'
// app.post('/questions/:productId/answers'
// app.put('/questions/:productId/helpful'
// app.put('/questions/:productId/report'
// app.put('/answers/:answerId/helpful'
// app.put('/answers/:answerId/report'




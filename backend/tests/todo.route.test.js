const agent = require('./api');

let todo_id;

describe('Todos test', () => {
  it('should create a todo', async () => {
    const res = await agent
      .post('/api/todos')
      .send({
        title: 'Acheter du lait',
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body).toHaveProperty('title');
    expect(res.body.title).toEqual('Acheter du lait');

    todo_id = res.body._id;
  });

  it('should retrieve a todo', async () => {
    const res = await agent
      .get(`/api/todos/${todo_id}`)
      .send({
        title: 'Acheter du lait',
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('_id');
    expect(res.body).toHaveProperty('title');
    expect(res.body.title).toEqual('Acheter du lait');
  });

  it('should patch a todo', async () => {
    const res = await agent
      .patch(`/api/todos/${todo_id}`)
      .send({
        title: 'Acheter du cacao',
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('_id');
    expect(res.body).toHaveProperty('title');
    expect(res.body.title).toEqual('Acheter du cacao');
  });

  it('should list todos', async () => {
    let res = await agent
      .get('/api/todos')
      .send();
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(expect.any(Array));
    expect(res.body.length).toEqual(1);
    expect(res.body[0]).toHaveProperty('_id');
    expect(res.body[0]).toHaveProperty('title');
    expect(res.body[0].title).toEqual('Acheter du cacao');
  });

  it('should search todos by title', async () => {
    let res = await agent
      .get('/api/todos/search?q=lait')
      .send();
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('data');
    expect(res.body.data).toEqual(expect.any(Array));
    expect(res.body.data.length).toEqual(0);
    expect(res.body).toHaveProperty('meta');
    expect(res.body.meta).toHaveProperty('pagination');

    res = await agent
      .get('/api/todos/search?q=cacao')
      .send();
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('data');
    expect(res.body.data).toEqual(expect.any(Array));
    expect(res.body.data.length).toEqual(1);
  });

  it('should add tags to a todo', async () => {
    let res = await agent
      .get('/api/todos/search?q=lait')
      .send();
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('data');
    expect(res.body.data).toEqual(expect.any(Array));
    expect(res.body.data.length).toEqual(0);
    expect(res.body).toHaveProperty('meta');
    expect(res.body.meta).toHaveProperty('pagination');
  });
});
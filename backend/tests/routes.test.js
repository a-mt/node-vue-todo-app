const agent = require('./api');

let todo_id, tag_id, tag_id2;

describe('Test todos endpoints', () => {
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
      .send();
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

  it('should search todos by title and not find anything', async () => {
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

  it('should search todos by title', async () => {
    let res = await agent
      .get('/api/todos/search?q=cacao')
      .send();
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('data');
    expect(res.body.data).toEqual(expect.any(Array));
    expect(res.body.data.length).toEqual(1);
    expect(res.body).toHaveProperty('meta');
    expect(res.body.meta).toHaveProperty('pagination');
  });

  it('should create tags', async () => {
    let res = await agent
      .post('/api/tags')
      .send({
        title: 'Frontend',
        color: 'rgb(0,0,255)',
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body).toHaveProperty('title');
    expect(res.body.title).toEqual('Frontend');
    tag_id = res.body._id;

    res = await agent
      .post('/api/tags')
      .send({
        title: 'Backend',
        color: 'rgb(255,0,0)',
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body).toHaveProperty('title');
    expect(res.body.title).toEqual('Backend');
    tag_id2 = res.body._id;
  });

  it('should add tags to a todo', async () => {
    let res = await agent
      .post(`/api/todos/${todo_id}/tags`)
      .send({
        tags: [tag_id, tag_id2]
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('tags');
    expect(res.body.tags.length).toBe(2);
    expect(res.body.tags[0]).toHaveProperty('title');
    expect(res.body.tags[0].title).toBe('Frontend');
  });

  it('should update a tag', async () => {
    let res = await agent
      .patch(`/api/tags/${tag_id}`)
      .send({
        title: 'Front-end',
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body.title).toEqual('Front-end');
  });

  it('should delete a tag', async () => {
    let res = await agent
      .delete(`/api/tags/${tag_id2}`)
      .send();
    expect(res.statusCode).toEqual(200);
  });

  it('should retrieve a todo with updated tags', async () => {
    const res = await agent
      .get(`/api/todos/${todo_id}`)
      .send();
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('tags');
    expect(res.body.tags).toEqual(expect.any(Array));
    expect(res.body.tags.length).toBe(1);
    expect(res.body.tags[0]).toHaveProperty('title');
    expect(res.body.tags[0].title).toBe('Front-end');
  });

  it('should delete a todo', async () => {
    let res = await agent
      .delete(`/api/todos/${todo_id}`)
      .send();
    expect(res.statusCode).toEqual(200);
  });

  it('should list todos and not find anything', async () => {
    let res = await agent
      .get('/api/todos')
      .send();
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(expect.any(Array));
    expect(res.body.length).toEqual(0);
  });
});
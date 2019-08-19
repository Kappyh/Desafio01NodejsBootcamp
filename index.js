const express = require('express');
const app = express();

app.use(express.json());

let requests = 0;
const projects = [
  {
    id: "1",
    title: 'MVP Fintech',
    tasks: []
  }
];

// Middlewares

// Global
app.use((req, res, next) => {
  requests++;
  console.log(requests);
  next();
})

// Only for request with ID param
function checkIfProjectExists(req, res, next) {
  if (!projects.includes(req.params.id)) {
    throw new Error(`Project with id ${req.params.id} does not exist`);
  }
  next();
}

app.get('/projects', (req, res) => {
  return res.json(projects);
});

app.post('/projects', (req, res) => {
  projects.push(req.body);
  return res.status(200).json(projects);
});

app.put('/projects/:id', checkIfProjectExists, (req, res) => {
  const id = req.params.id;
  const projeto = req.body;
  for (let i = 0; i < projects.length; i++) {
    if (projects[i].id === id) {
      projects[i].title = projeto.title;
      break;
    }
  }
  return res.status(200).json(projects);
});

app.delete('/projects/:id', checkIfProjectExists, (req, res) => {
  const id = req.params.id;
  projects.filter(projeto => {
    if (projeto.id == id) {
      const index = projects.indexOf(projeto);
      projects.splice(index, 1);
    }
  });
  return res.sendStatus(204);
});

app.post('/projects/:id/tasks', checkIfProjectExists, (req, res) => {
  const { id } = req.params;
  projects.filter(project => {
    if (project.id == id) {
      project.tasks.push(req.body);
    }
  });
  return res.sendStatus(200);
});

app.listen('3000', () => {
  console.log('server up');
})
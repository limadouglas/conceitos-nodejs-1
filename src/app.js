const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

const validateExistId = (request, response, next) =>{
  const { id } = request.params;
  const repositoryIndex = repositories.findIndex(repository => repository.id === id)
  
  if(repositoryIndex < 0)
    return response.status(400).json({error: "Repository Not Found!"});

  next();
}

app.use("/repositories/:id", validateExistId);


app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const {title, url, techs} = request.body;
  const repositoryIndex = repositories.push({
    id: uuid(),
    likes: 0,
    title,
    url,
    techs
  });
  return response.json(repositories[repositoryIndex-1]);
});

app.put("/repositories/:id", (request, response) => {
  const {id} = request.params;
  const {title, url, techs} = request.body;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  repositories[repositoryIndex] = {
    id, 
    title, 
    url, 
    techs, 
    likes: repositories[repositoryIndex].likes
  }

  return response.json(repositories[repositoryIndex]);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
  
  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
  
  repositories[repositoryIndex].likes++;

  return response.json({likes: repositories[repositoryIndex].likes});
});

module.exports = app;

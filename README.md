# ded-companion
## Here are some examples to use the api, that is WIP

### Create characters
POST http://localhost:3333/characters
Content-Type: application/json

{
    "name": "newbie",
    "level": "1",
    "class": "Warrior"
}

### List characters
GET http://localhost:3333/characters

### Search usign Quey parameters

GET http://localhost:3333/characters?search=newbie

### Update Character

PUT http://localhost:3333/characters/892b2b5d-edaf-4153-aa8a-8307be7020ba
Content-Type: application/json

{
  "name": "Not a dummie anymore",
  "level": 2,
  "class": "Warrior"
}

### Delete Character

DELETE http://localhost:3333/characters/892b2b5d-edaf-4153-aa8a-8307be7020ba

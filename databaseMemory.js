import { randomUUID } from "node:crypto";

export class DatabaseMemory {
  #characters = new Map();

  list(search) {
    return Array.from(this.#characters.entries())
      .map((charactersArray) => {
        const id = charactersArray[0];
        const data = charactersArray[1];
        return {
          id,
          ...data,
        };
      })
      .filter((character) => {
        if (search) {
          return character.name.includes(search);
        }
        return true;
      });
  }

  create(character) {
    const characterId = randomUUID();
    this.#characters.set(characterId, character);
  }

  update(id, character) {
    this.#characters.set(id, character);
  }

  delete(id) {
    this.#characters.delete(id);
  }
}

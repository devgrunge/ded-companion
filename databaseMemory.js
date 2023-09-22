export class DatabaseMemory {
  #videos = new Map();

  create(video) {
    this.#videos.push(video);
  }

  update(id, video) {
    this.#videos.push(video);
  }
}

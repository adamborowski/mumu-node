export default function createTodoManager(onPatch) {
  let todos = [];

  return {
    add(id, values) {
      // TODO
      onPatch("...");
    },

    remove(id) {
      // TODO
      onPatch("...");
    },

    updateContent(id, content) {
      // TODO
      onPatch("...");
    },

    addNote(id, note) {
      // TODO
      onPatch("...");
    },

    clearNote(id, noteIndex) {
      // TODO
      onPatch("...");
    },

    getTodos() {
      Object.freeze(todos); // ensure we don't give the client the ability to mutate the state
      return todos;
    },

    applyPatches(patches) {
      // TODO
    },
  };
}
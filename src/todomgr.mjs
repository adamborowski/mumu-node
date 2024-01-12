import { produce, enableMapSet, applyPatches, enablePatches } from "immer";

enablePatches();
export default function createTodoManager(onPatch) {
  let todos = [];

  return {
    add(id, values) {
      const nextState = produce(
        todos,
        (draft) => {
          draft.push({
            id,
            content: values.content,
            done: false,
            subnotes: [],
          });
        },
        (patches) => onPatch(patches),
      );

      todos = nextState;
    },

    remove(id) {
      const nextState = produce(
        todos,
        (draft) => {
          const index = draft.findIndex((todo) => todo.id === id);
          if (index !== -1) draft.splice(index, 1);
        },
        (patches) => onPatch(patches),
      );

      todos = nextState;
    },

    updateContent(id, content) {
      const nextState = produce(
        todos,
        (draft) => {
          const todo = draft.find((t) => t.id === id);
          if (todo) {
            todo.content = content;
          }
        },
        (patches) => onPatch(patches),
      );

      todos = nextState;
    },

    addNote(id, note) {
      const nextState = produce(
        todos,
        (draft) => {
          const todo = draft.find((t) => t.id === id);
          if (todo) {
            todo.subnotes.push(note);
          }
        },
        (patches) => onPatch(patches),
      );

      todos = nextState;
    },

    clearNote(id, noteIndex) {
      const nextState = produce(
        todos,
        (draft) => {
          const todo = draft.find((t) => t.id === id);
          if (todo && todo.subnotes[noteIndex] !== undefined) {
            todo.subnotes.splice(noteIndex, 1);
          }
        },
        (patches) => onPatch(patches),
      );

      todos = nextState;
    },

    getTodos() {
      return todos;
    },

    applyPatches(patches) {
      todos = applyPatches(todos, patches);
    },
  };
}

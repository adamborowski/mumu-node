import { expect, describe, beforeEach, it } from "vitest";
import createTodoManager from "./todomgr.mjs";

describe("TodoManager", () => {
  let todoManager;
  let patches;

  beforeEach(() => {
    patches = [];
    todoManager = createTodoManager((ps) => (patches = patches.concat(ps)));
  });

  it("should add a todo item and generate correct patch", () => {
    todoManager.add("1", { content: "Test Todo" });
    expect(todoManager.getTodos()).to.deep.equal([
      { id: "1", content: "Test Todo", done: false, subnotes: [] },
    ]);
    expect(patches[0]).to.deep.equal({
      op: "add",
      path: [0],
      value: {
        id: "1",
        content: "Test Todo",
        done: false,
        subnotes: [],
      },
    });
  });

  it("should remove a todo item and generate correct patch", () => {
    todoManager.add("1", { content: "Test Todo" });
    patches = [];
    todoManager.remove("1");
    expect(todoManager.getTodos()).to.deep.equal([]);
    expect(patches[0]).to.deep.equal({
      op: "remove",
      path: [0]
    });
  });

  it("should update content of a todo item and generate correct patch", () => {
    todoManager.add("1", { content: "Test Todo" });
    patches = [];
    todoManager.updateContent("1", "Updated Content");
    expect(todoManager.getTodos()[0].content).to.equal("Updated Content");
    expect(patches[0]).to.deep.equal({
      op: "replace",
      path:[0, "content"],
      value: "Updated Content",
    });
  });

  it("should add a note to a todo item and generate correct patch", () => {
    todoManager.add("1", { content: "Test Todo" });
    patches = [];
    todoManager.addNote("1", "First Note");
    expect(todoManager.getTodos()[0].subnotes).to.include("First Note");
    expect(patches[0]).to.deep.equal({
      op: "add",
      path: [0, "subnotes", 0],
      value: "First Note",
    });
  });

  it("should clear a note from a todo item and generate correct patch", () => {
    todoManager.add("1", { content: "Test Todo" });
    todoManager.addNote("1", "First Note");
    patches = [];
    todoManager.clearNote("1", 0);
    expect(todoManager.getTodos()[0].subnotes).to.be.empty;
    expect(patches[0]).to.deep.equal({
      op: "remove",
      path: [0, "subnotes", 0],
    });
  });

  describe('applyPatches', () => {
    function seed(){
      todoManager.add("1", { content: "Test Todo" });
      todoManager.add("2", { content: "Another Todo" });
      todoManager.add("3", { content: "Yet Another Todo" });
    }

    it("should apply an add patch correctly", () => {
      seed();
      const addPatch = [
        {
          op: "add",
          path: [0],
          value: { id: "4", content: "New Todo", done: false, subnotes: [] },
        },
      ];
      todoManager.applyPatches(addPatch);
      expect(todoManager.getTodos()).to.deep.equal([
        { id: "4", content: "New Todo", done: false, subnotes: [] },
        { id: "1", content: "Test Todo", done: false, subnotes: [] },
        { id: "2", content: "Another Todo", done: false, subnotes: [] },
        { id: "3", content: "Yet Another Todo", done: false, subnotes: [] },
      ]);
    });
    it("should apply a remove patch correctly", () => {
      seed();
      const removePatch = [
        {
          op: "remove",
          path: [0],
        },
      ];
      todoManager.applyPatches(removePatch);
      expect(todoManager.getTodos()).to.deep.equal([
        { id: "2", content: "Another Todo", done: false, subnotes: [] },
        { id: "3", content: "Yet Another Todo", done: false, subnotes: [] },
      ]);
    });
    it("should apply a replace patch correctly", () => {
      seed();
      const replacePatch = [
        {
          op: "replace",
          path: [0, "content"],
          value: "Updated Content",
        },
      ];
      todoManager.applyPatches(replacePatch);
      expect(todoManager.getTodos()).to.deep.equal([
        { id: "1", content: "Updated Content", done: false, subnotes: [] },
        { id: "2", content: "Another Todo", done: false, subnotes: [] },
        { id: "3", content: "Yet Another Todo", done: false, subnotes: [] },
      ]);
    });
    it("should apply a subnote add patch correctly", () => {
      seed();
      const addPatch = [
        {
          op: "add",
          path: [0, "subnotes", 0],
          value: "First Note",
        },
      ];
      todoManager.applyPatches(addPatch);
      expect(todoManager.getTodos()).to.deep.equal([
        { id: "1", content: "Test Todo", done: false, subnotes: ["First Note"] },
        { id: "2", content: "Another Todo", done: false, subnotes: [] },
        { id: "3", content: "Yet Another Todo", done: false, subnotes: [] },
      ]);
    });
    it("should apply a subnote remove patch correctly", () => {
      seed();
      todoManager.addNote("1", "First Note");
      const removePatch = [
        {
          op: "remove",
          path: [0, "subnotes", 0],
        },
      ];
      todoManager.applyPatches(removePatch);
      expect(todoManager.getTodos()).to.deep.equal([
        { id: "1", content: "Test Todo", done: false, subnotes: [] },
        { id: "2", content: "Another Todo", done: false, subnotes: [] },
        { id: "3", content: "Yet Another Todo", done: false, subnotes: [] },
      ]);
    });
    it("should apply multiple patches correctly", () => {
      seed();
      const patches = [
        {
          op: "add",
          path: [0],
          value: { id: "4", content: "New Todo", done: false, subnotes: [] },
        },
        {
          op: "remove",
          path: [2],
        },
        {
          op: "replace",
          path: [1, "content"],
          value: "Updated Content",
        },
        {
          op: "add",
          path: [1, "subnotes", 0],
          value: "First Note",
        },
        {
          op: "add",
          path: [1, "subnotes", 1],
          value: "Second Note",
        },
        {
          op: "remove",
          path: [1, "subnotes", 0],
        },
      ];
      todoManager.applyPatches(patches);
      expect(todoManager.getTodos()).to.deep.equal([
        { id: "4", content: "New Todo", done: false, subnotes: [] },
        { id: "1", content: "Updated Content", done: false, subnotes: ['Second Note'] },
        { id: "3", content: "Yet Another Todo", done: false, subnotes: []}
      ]);
    });
  })

});

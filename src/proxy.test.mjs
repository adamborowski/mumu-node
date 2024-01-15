import { describe, it, expect } from "vitest";
import { createDogsApi } from "./proxy.js";

describe("Proxy", () => {
  describe("demo", () => {
    it("should work with basic example", async () => {
      console.log("lets start dogs play");
      const dogs = createDogsApi(createFakeApi());
      console.log("await dogs.dexter");
      const myDog = await dogs.dexter;
      console.log("just fetched my dog", printDog(myDog));
      console.log("lets change my dog name to Pikuś");
      await myDog({ name: "Pikuś" });
      console.log("just changed my dog name to 12", printDog(myDog));
      console.log("lets change my dog age to 12");
      await myDog({ age: 12 });
      console.log("just changed my dog age", printDog(myDog));
      console.log("lets delete my dog");
      delete dogs.dexter;
      console.log("just deleted my dog", printDog(myDog));
      const myDogAgain = await dogs.dexter;
      console.log("just fetched my dog after deleting", printDog(myDogAgain));
    });
  });
  describe(
    "acceptance tests",
    () => {
      it("should fetch a dog correctly", async () => {
        const dogs = createDogsApi(createFakeApi());
        const myDog = await dogs.dexter;
        expect(myDog).toBeDefined();
        expect(myDog.name).toBe("Dexter");
      });

      it("should update a dog's name correctly", async () => {
        const dogs = createDogsApi(createFakeApi());
        const myDog = await dogs.cooper;
        await myDog({ name: "Pikuś" });
        expect(myDog.name).toBe("Pikuś");
        const myDogAgain = await dogs.cooper;
        expect(myDogAgain.name).toBe("Pikuś");
      });

      it("should update a dog's age correctly", async () => {
        const dogs = createDogsApi(createFakeApi());
        const myDog = await dogs.dexter;
        await myDog({ age: 12 });
        expect(myDog.age).toBe(12);
        const myDogAgain = await dogs.dexter;
        expect(myDogAgain.age).toBe(12);
      });

      it("should delete a dog correctly", async () => {
        const dogs = createDogsApi(createFakeApi());
        const myDog = await dogs.max; // Ensure dog is fetched
        delete dogs.max;
        expect(myDog.id).toBe(-1);
        const myDogAgain = await dogs.max;
        expect(myDogAgain).toBeUndefined();
      });

      it("should handle non-existent dogs", async () => {
        const dogs = createDogsApi(createFakeApi());
        const nonExistentDog = await dogs.nonExistent;
        expect(nonExistentDog).toBeUndefined();
      });

      it("should update multiple properties of a dog", async () => {
        const dogs = createDogsApi(createFakeApi());
        const myDog = await dogs.dexter;
        await myDog({ name: "NewName", age: 10 });
        expect(myDog.name).toBe("NewName");
        expect(myDog.age).toBe(10);
        const myDogAgain = await dogs.dexter;
        expect(myDogAgain.name).toBe("NewName");
        expect(myDogAgain.age).toBe(10);
      });

      it("should handle operations with multiple dogs", async () => {
        const dogs = createDogsApi(createFakeApi());
        const dog1 = await dogs.dexter;
        const dog2 = await dogs.luna;

        await dog1({ age: 10 });
        await dog2({ age: 5 });

        expect(dog1.age).toBe(10);
        expect(dog2.age).toBe(5);

        const dog1Again = await dogs.dexter;
        const dog2Again = await dogs.luna;

        expect(dog1Again.age).toBe(10);
        expect(dog2Again.age).toBe(5);
      });
    },
    { timeout: 5000 },
  );
});

function createFakeApi() {
  let fakeDogs = [
    {
      id: "dexter",
      name: "Dexter",
      breed: "Labrador",
      age: 5,
    },
    {
      id: "luna",
      name: "Luna",
      breed: "Labrador",
      age: 4,
    },
    {
      id: "max",
      name: "Max",
      breed: "Labrador",
      age: 3,
    },
    {
      id: "charlie",
      name: "Charlie",
      breed: "Labrador",
      age: 2,
    },
    {
      id: "cooper",
      name: "Cooper",
      breed: "Labrador",
      age: 1,
    },
    {
      id: "buddy",
      name: "Buddy",
      breed: "Labrador",
      age: 6,
    },
  ];
  return {
    get: (id) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(fakeDogs.find((dog) => dog.id === id) ?? undefined);
        }, 500);
      });
    },
    patch: (id, fields) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const foundDog = fakeDogs.find((dog) => dog.id === id);
          if (foundDog) {
            const updatedDog = { ...foundDog, ...fields };
            fakeDogs = fakeDogs.map((dog) =>
              dog.id === id ? updatedDog : dog,
            );
            resolve(updatedDog);
          } else {
            reject(new Error("Dog not found"));
          }
        }, 500);
      });
    },
    delete: (id) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const dogIndex = fakeDogs.findIndex((dog) => dog.id === id);
          if (dogIndex !== -1) {
            fakeDogs = fakeDogs.filter((dog) => dog.id !== id);
            resolve();
          } else {
            reject(new Error("Dog not found"));
          }
        }, 500);
      });
    },
  };
}

const printDog = (dog) => {
  if (!dog) return "[Not a dog]";
  if (dog.id === -1) return `[Dog deleted locally]`;
  return `[${dog.name} (${dog.breed}) ${dog.age}yo]`;
};

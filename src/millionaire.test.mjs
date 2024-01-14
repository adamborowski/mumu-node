import {describe, it} from "vitest";
import {startMillionaire} from "./millionaire.mjs";

describe('Millionaire', () => {
  it('should work', async () => {
    await startMillionaire()
  },{
    timeout: 60000
  });
})
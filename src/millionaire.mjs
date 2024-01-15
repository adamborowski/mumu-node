const log = (() => {
  const time = Date.now()
  return (message) => {
    console.log(`${(Date.now() - time).toString().padStart(6, ' ')} ms: ${message}`)
  }
})()

const drawAnswer = (challenge) => {
  const randomIndex = Math.floor(Math.random() *4)
  return challenge.answers['abcd'[randomIndex]]
}

const startParticipant = (name, challenge, signal) =>
  new Promise((resolve, reject) => {
    log(`${name} started thinking...`);

    const timeoutId = setTimeout(() => {
      const answer = drawAnswer(challenge);
      log(`${name} is answering ${answer}!`);
      resolve({name, answer});
    }, 2000 + Math.random() * 10000); // in total, the person can answer in 2-12 seconds

    signal.addEventListener('abort', () => {
      log(`${name} is interrupted!`);
      clearTimeout(timeoutId);
      reject();
    })

  });

const awaitFirstProperAnswer = (participantSimulators, challenge) => {
  const goodSimulators = participantSimulators.map((simulator) =>
    new Promise((resolve, reject) => {
      simulator.then((result) => {
        if (result.answer === challenge.answer) {
          resolve(result);
        }
      }).catch(reject)
    }))
  return Promise.race(goodSimulators);
};

export function startMillionaire() {
  return new Promise((resolve) => {
    const participants = [
      "John",
      "Jane",
      "Jack",
      "Jill",
      "James",
      "Judy",
      "Jasmine",
      "Jared",
      "Jocelyn",
      "Javier",
    ];
    const challenge = {
      question: "What is the capital of France?",
      answer: "Paris",
      answers: {
        a: "Paris",
        b: "London",
        c: "Berlin",
        d: "Madrid",
      },
    };


    const abortController = new AbortController();

    const stopGame = () => {
      // ?? How to cancel the game?
      abortController.abort();
      log("Game stopped!");
      resolve()
    };


    const participantSimulators = participants.map((name) =>
      startParticipant(name, challenge, abortController.signal)
    );


    setTimeout(() => {
      log("Time is up!");
      stopGame();
    }, 10000); // after 10 seconds, cancel the game

    awaitFirstProperAnswer(participantSimulators, challenge).then((winner) => {
      log(`The winner is ${winner.name} with answer ${winner.answer}`);
      log('Stopping the game!')
      stopGame(); // we also cancel the game here, so no one else should work on the answer
    }).catch(() => {
      log('No one answered correctly!')
      stopGame();
    })
  })
}
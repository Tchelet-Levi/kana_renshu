import type { SPPool } from "../../global";

type Answer = {
  character: string;
  fails: number;
  order: number;
};

type Question = {
  question: string;
  answer: string;
};

function roll(pool: object, charactersToIgnore?: string[], recursions: number = 0): Question {
  let charArr = Object.keys(pool);

  let randomNumber = Math.random();
  let charIndex = Math.floor(randomNumber * charArr.length);

  let randomKana: string = charArr[charIndex];
  let randomRomaji: string = pool[randomKana];

  // This is here because I am scared of infinite recursions :)
  if (recursions > 10) return null;

  // Make sure we didn't roll a character we wanted to ignore.
  if (charactersToIgnore) {
    // Make sure the characters.length isn't bigger than the length of the pool
    const poolKeys = Object.keys(pool);
    if (poolKeys.length >= charactersToIgnore.length) return null;

    charactersToIgnore.forEach((charToIgnore) => {
      if (randomKana === charToIgnore) {
        return roll(pool, charactersToIgnore, recursions++);
      }
    });
  }

  return { question: randomKana, answer: randomRomaji };
}

// Smart Practice

// TODO: The maximum size of the previousAnswers shouldn't be bigger than 15. Only practice on these 15 until user starts getting things correct.
export function spGenerateQuiz(pool: object, previousAnswers?: Answer[]): Question[] {
  let quiz: Question[];
  let correctlyGuessedChars: string[] = [];
  let incorrectlyGuessedChars: string[] = [];

  if (!previousAnswers) {
    // Get an object with 5 random characters
    const newCharacters = generateQuestions(pool, 5);

    newCharacters.forEach((char) => quiz.push(char));
  }

  if (previousAnswers) {
    // Assign correctly and incorrectly guessed chars to their respective arrays
    previousAnswers.forEach((prevAnswer) => {
      if (prevAnswer.fails === 0) {
        correctlyGuessedChars.push(prevAnswer.character);
      } else {
        incorrectlyGuessedChars.push(prevAnswer.character);
      }
    });

    const charactersToIgnore = [...incorrectlyGuessedChars, ...correctlyGuessedChars];

    // Generate 4/5 new characters to be quizzed on.
    const newCharacters = generateQuestions(pool, 4, charactersToIgnore);
    newCharacters.forEach((char) => quiz.push(char));

    // Push the incorrectly guessed characters in order of failed attempts.
    let sortedIncorrectlyGuessedChars = sortPreviousAnswersArray(previousAnswers);
    sortedIncorrectlyGuessedChars.forEach((char) => {
      // Find the char in the pool.
      // User could've switched. So if they exist put them. If not, don't.
      const failedQuestion: Question = pool[char];
      if (failedQuestion) {
        quiz.push(failedQuestion);
      }
    });

    // Generate 5/5 new characters to be quizzed on. This is here to avoid accidentally quizzing on the same character twice in a row.
    const lastNewCharacter = generateQuestions(pool, 1, charactersToIgnore)[0];
    quiz.push(lastNewCharacter);
  }

  return quiz;
}

function generateQuestions(
  pool: object,
  numOfChars: number,
  charactersToIgnore?: string[]
): Question[] {
  if (numOfChars <= 0) return undefined;

  let questionArr: Question[];

  for (let i = 0; i < numOfChars; i++) {
    const newQuestion: Question = roll(pool, charactersToIgnore);
    questionArr.push(newQuestion);
  }

  return questionArr;
}

/**
 * @param previousAnswers
 * @returns an array of characters, sorted by failed attempts. least failed come first, last are most failed (eg [1,1,2,2,3,4,5,5,5])
 */
function sortPreviousAnswersArray(previousAnswers: Answer[]): string[] {
  let sortedArr: string[] = [];

  previousAnswers.sort((a, b) => a.fails - b.fails);
  previousAnswers.forEach((prevAnswer) => {
    sortedArr.push(prevAnswer.character);
  });

  return sortedArr;
}

// Simple (random) quiz

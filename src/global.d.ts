/// <reference types="svelte" />

export type Theme = "os" | "light-theme" | "dark-theme";

export type QuizMenuOptions = {
  "h-mon": boolean;
  "h-dia": boolean;
  "h-dig": boolean;
  "k-mon": boolean;
  "k-dia": boolean;
  "k-dig": boolean;
};

export interface CharacterDictionary {
  "hiragana-monographs": object;
  "hiragana-diacritics": object;
  "hiragana-digraphs": object;
  "hiragana-digraph-diacritics": object;
  "katakana-monographs": object;
  "katakana-diacritics": object;
  "katakana-digraphs": object;
  "katakana-digraph-diacritics": object;
}

export interface UserSettings {
  forceRomajiInput: boolean;
  showAutocorrectWarning: boolean;
  showWelcomeScreen: boolean;
  useSmartPractice: boolean;
  showPreviousGuesses: boolean;
  spacebarAnswers: boolean;
}

export type SPPool = {
  [string]: [number];
};

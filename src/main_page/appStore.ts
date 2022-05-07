import { onDestroy } from "svelte";
import { writable } from "svelte/store";
import type { QuizMenuOptions, Theme, UserSettings } from "../global";

const userTheme: Theme = (localStorage.getItem("theme") as Theme) || "os";
export const theme = writable<Theme>(userTheme);

export const quizOptionsStore = writable<QuizMenuOptions>({
  "h-mon": true,
  "h-dia": false,
  "h-dig": false,
  "k-mon": false,
  "k-dia": false,
  "k-dig": false,
});

// User Settings
// Load user settings
const jsonUserSettings = localStorage.getItem("user-settings");
const parsedUserSettings = JSON.parse(jsonUserSettings);

const defaults = {
  forceRomajiInput: true,
  showAutocorrectWarning: true,
  showWelcomeScreen: true,
  useSmartPractice: true,
  showPreviousGuesses: true,
  spacebarAnswers: false,
};

// Set the parsedUserSettings value or if null, defaults.
export const userSettings = writable<UserSettings>(parsedUserSettings || defaults);

// Anytime the store changes, update to local storage
userSettings.subscribe((value) => localStorage.setItem("user-settings", JSON.stringify(value)));

import type { CharacterDictionary, QuizMenuOptions, Theme } from "../../global";

// Themes
export function getOSTheme(): Theme {
  if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return "dark-theme";
  }

  // light theme if not dark and if no preference
  return "light-theme";
}

export function setTheme(theme: Theme) {
  let newTheme: Theme;

  if (theme === "os") {
    newTheme = getOSTheme();
  } else {
    newTheme = theme;
  }

  // Remove all classes
  document.body.removeAttribute("class");

  // Add new class
  document.body.classList.add(newTheme);
}

/** Returns an object made of the icon's name and its absolute path.
 *  @example const moonIconPath = getIconPath().moon; // returns "/assets/svg/moon.svg"
 */
export function getIconPath() {
  const fullPath = (key: string) => {
    return `/assets/svg/${key}.svg`;
  };

  const svgPaths = {
    "contrast-outline": fullPath("contrast-outline"),
    moon: fullPath("moon"),
    sunny: fullPath("sunny"),
    settings: fullPath("settings"),
    "settings-sharp": fullPath("settings-sharp"),
    "settings-outline": fullPath("settings-outline"),
    "checkmark-outline": fullPath("checkmark-outline"),
    "checkmark-sharp": fullPath("checkmark-sharp"),
    alert: fullPath("alert"),
    "help-circle-outline": fullPath("help-circle-outline"),
    "chevron-back-outline": fullPath("chevron-back-outline"),
    "close-outline": fullPath("close-outline"),
  };

  return svgPaths;
}

export function getThemeIconSVGPath(theme: Theme) {
  if (theme === "os") return getIconPath()["contrast-outline"];
  if (theme === "dark-theme") return getIconPath().moon;
  if (theme === "light-theme") return getIconPath().sunny;
}

// App
/** Generate a pool of questions and answers to later select a random question answer pair from. */
export function generatePool(
  quizOptions: QuizMenuOptions,
  characterDictionary: CharacterDictionary
) {
  let pool = {};

  if (quizOptions["h-mon"]) pool = { ...pool, ...characterDictionary["hiragana-monographs"] };
  if (quizOptions["h-dia"]) pool = { ...pool, ...characterDictionary["hiragana-diacritics"] };
  if (quizOptions["h-dig"]) pool = { ...pool, ...characterDictionary["hiragana-digraphs"] };
  if (quizOptions["h-dia"] && quizOptions["h-dig"])
    pool = { ...pool, ...characterDictionary["hiragana-digraph-diacritics"] };

  if (quizOptions["k-mon"]) pool = { ...pool, ...characterDictionary["katakana-monographs"] };
  if (quizOptions["k-dia"]) pool = { ...pool, ...characterDictionary["katakana-diacritics"] };
  if (quizOptions["k-dig"]) pool = { ...pool, ...characterDictionary["katakana-digraphs"] };
  if (quizOptions["k-dia"] && quizOptions["k-dig"])
    pool = { ...pool, ...characterDictionary["katakana-digraph-diacritics"] };

  return pool;
}

export function generateQuestion(pool: object) {
  // Check if pool is empty
  if (Object.keys(pool).length === 0) {
    return { question: null, answer: null };
  }

  // Roll for it
  let charArr = Object.keys(pool);
  let randomNumber = Math.random();
  let charIndex = Math.floor(randomNumber * charArr.length);

  let randomKey: string = charArr[charIndex];
  let randomValue: string = pool[randomKey];

  return { question: randomKey, answer: randomValue };
}

/** Returns true if the answer provided is the correct answer for the question. */
export function evaluateAnswer(userInput: string, answer: string): Boolean {
  if (userInput.toLowerCase() === answer) return true;
  return false;
}

export function isUsingTouchScreen() {
  if (window.matchMedia("(pointer: coarse)").matches) {
    return true;
  }

  return false;
}

export function getUserOS() {
  if (navigator.userAgent.indexOf("Win") != -1) return "Windows";
  if (navigator.userAgent.indexOf("Mac") != -1) return "MacOS";
  if (navigator.userAgent.indexOf("X11") != -1) return "UNIX";
  if (navigator.userAgent.indexOf("Linux") != -1) return "Linux";

  return "unknown";
}

export function getMobileOperatingSystem() {
  let userAgent = navigator.userAgent || navigator.vendor;

  // Windows Phone must come first because its UA also contains "Android"
  if (/windows phone/i.test(userAgent)) {
    return "Windows Phone";
  }

  if (/android/i.test(userAgent)) {
    return "Android";
  }

  // iOS detection from: http://stackoverflow.com/a/9039885/177710
  if (/iPad|iPhone|iPod/.test(userAgent)) {
    return "iOS";
  }

  return "unknown";
}

// The locale our app first shows
const defaultLocale = "en";
const supportedLocales = ["en", "pt"];
// The active locale
let locale;

// Gets filled with active locale translations
let translations = {};

// When the page content is ready...
document.addEventListener("DOMContentLoaded", () => {
  const initialLocale = supportedOrDefault(browserLocales(true));
  // Translate the page to the default locale
  setLocale(initialLocale);
  bindLocaleSwitcher(initialLocale);
});
function isSupported(locale) {
  return supportedLocales.indexOf(locale) > -1;
}
function supportedOrDefault(locales) {
  return locales.find(isSupported) || defaultLocale;
}
// ...
function browserLocales(languageCodeOnly = false) {
  return navigator.languages.map((locale) =>
    languageCodeOnly ? locale.split("-")[0] : locale
  );
}
// Whenever the user selects a new locale, we
// load the locale's translations and update
// the page
function bindLocaleSwitcher(initialValue) {
  const switcherLinks = document.querySelectorAll("[data-i18n-switcher] a");

  switcherLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      // Set the locale to the selected data-value attribute
      setLocale(link.getAttribute("data-value"));
    });
  });

  // Set the initial value based on the current locale
  switcherLinks.forEach((link) => {
    if (link.getAttribute("data-value") === initialValue) {
      link.classList.add("active"); // Optionally mark the active language
    }
  });
}

/**
 * Retrieve user-preferred locales from the browser
 *
 * @param {boolean} languageCodeOnly - when true, returns
 * ["en", "fr"] instead of ["en-US", "fr-FR"]
 * @returns array | undefined
 */
function browserLocales(languageCodeOnly = false) {
  return navigator.languages.map((locale) =>
    languageCodeOnly ? locale.split("-")[0] : locale
  );
}

// Load translations for the given locale and translate
// the page to this locale
async function setLocale(newLocale) {
  if (newLocale === locale) return;

  const newTranslations = await fetchTranslationsFor(newLocale);

  locale = newLocale;
  translations = newTranslations;

  translatePage();
}

// Retrieve translations JSON object for the given
// locale over the network
async function fetchTranslationsFor(newLocale) {
  const response = await fetch(`/lang/${newLocale}.json`);
  return await response.json();
}

// Replace the inner text of each element that has a
// data-i18n-key attribute with the translation corresponding
// to its data-i18n-key
function translatePage() {
  document.querySelectorAll("[data-i18n-key]").forEach(translateElement);
}

// Replace the inner text of the given HTML element
// with the translation in the active locale,
// corresponding to the element's data-i18n-key
function translateElement(element) {
  const key = element.getAttribute("data-i18n-key");
  const translation = translations[key];
  element.innerText = translation;
}

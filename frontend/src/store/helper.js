/**
 * Add an item to a localStorage() array
 * @param {String} name  The localStorage() key
 * @param {String} value The localStorage() value
 */
export const addToLocalStorageArray = function (name, value) {
  // Get the existing data
  let existing = localStorage.getItem(name);

  // If no existing data, create an array
  // Otherwise, convert the localStorage string to an array
  existing = existing ? JSON.parse(existing) : [];

  // Add new data to localStorage Array
  existing.unshift(value);

  // existing = [...existing, ...value]

  // Save back to localStorage
  localStorage.setItem(name, JSON.stringify(existing));
};

/**
 * Add an item to a localStorage() object
 * @param {String} name  The localStorage() key
 * @param {String} key   The localStorage() value object key
 * @param {String} value The localStorage() value object value
 */
export const addToLocalStorageObject = function (name, key, value) {
  // Get the existing data
  let existing = localStorage.getItem(name);

  // If no existing data, create an array
  // Otherwise, convert the localStorage string to an array
  existing = existing ? JSON.parse(existing) : {};

  // Add new data to localStorage Array
  existing[key] = value;

  // Save back to localStorage
  localStorage.setItem(name, JSON.stringify(existing));
};

export const updateLocalStorageArray = function (name, data) {
  // Get the existing data
  let existing = localStorage.getItem(name);

  // If no existing data, create an array
  // Otherwise, convert the localStorage string to an array
  existing = existing ? JSON.parse(existing) : [];

  // Update new data to localStorage Array
  const value = Object.assign(existing, data);

  // Save back to localStorage
  localStorage.setItem(name, JSON.stringify(value));
};

export const removeLocalStorageTokens = function () {
  localStorage.removeItem("token");
  localStorage.removeItem("refresh");
  localStorage.removeItem("user");
  localStorage.removeItem("vuex");
};

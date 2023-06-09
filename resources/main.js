const vscode = acquireVsCodeApi();
let elements = document.getElementsByClassName("formElement");
let state = vscode.getState();
if (!state) {
  state = {};
}
vscode.postMessage({ command: 'sync', data: state });

for (let el of elements) {
  let name = el.getAttribute("name");

  // Set listeners to set persistent internal state and notify the extension
  if (el.type === 'text') {
    if (state[name]) {
      el.value = state[name];
    }
    el.addEventListener('keyup', (e) => {
      if (e.key === 'Enter' || e.keyCode === 13) {
        updateState(name, el.value);
      }
    });
    el.addEventListener('blur', (e) => {
        updateState(name, el.value);
    });
  } else if ((el.type === 'button') || (el.type === 'submit')) {
    el.addEventListener('click', () => vscode.postMessage({ command: name }));
  } else if (el.type === 'checkbox') {
    if (state[name]) {
      el.checked = state[name];
    }
    el.addEventListener('click', () => updateState(name, el.checked));
  } else {
    if (state[name]) {
      el.value = state[name];
    }
    el.addEventListener('click', () => updateState(name, el.value));
  }
}

function updateState(key, value) {
  let state = vscode.getState();
  if (!state) {
    state = {};
  }
  var oldVal = state[key];
  state[key] = value;

  if (oldVal !== value) {
    vscode.setState(state);
    vscode.postMessage({ command: 'sync', data: state });
  }
}

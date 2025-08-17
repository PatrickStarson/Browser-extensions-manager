const toggle = document.querySelector('#mode-toggle');
const icon = document.querySelector('#icon');

const container = document.getElementById('extensions-container');

let extensions = [];

// Apply theme on page load
window.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme');

  if (savedTheme === 'light') {
    document.documentElement.classList.add('light-mode');
    toggle.checked = true;
    icon.innerHTML = `<img src="assets/images/icon-sun.svg" alt="light mode" />`;
  } else {
    document.documentElement.classList.remove('light-mode');
    toggle.checked = false;
    icon.innerHTML = `<img src="assets/images/icon-moon.svg" alt="dark mode" />`;
  }
});

// Toggle theme when checkbox changes
toggle.addEventListener('change', () => {
  document.documentElement.classList.toggle('light-mode');

  if (document.documentElement.classList.contains('light-mode')) {
    icon.innerHTML = '<img src="assets/images/icon-sun.svg" alt="light mode">';
    localStorage.setItem('theme', 'light');
  } else {
    icon.innerHTML = '<img src="assets/images/icon-moon.svg" alt="dark mode">';
    localStorage.setItem('theme', 'dark');
  }
});

fetch('data.json')
  .then(response => response.json())
  .then(data => {
    extensions = data;
    renderExtensions(extensions);
    attachListeners(); // Attach listeners after rendering
  });

function renderExtensions(list) {
  container.innerHTML = '';
  list.forEach(item => {
    const card = document.createElement('div');
    card.classList.add('extension-card');
    if (item.isActive) {
      card.classList.add('show-active');
    } else {
      card.classList.add('show-inactive');
    }
    card.innerHTML = `
      <div class="extension-logo-text">
        <img src="${item.logo}" alt="${item.name}" />
        <div class="extension-text">
          <h3>${item.name}</h3>
          <p>${item.description}</p>
        </div>
      </div>
      <div class="button-and-toggle">
        <button class="remove-btn">Remove</button>
        <label class="activityToggle">
          <input type="checkbox" class="activityCheckbox" ${item.isActive ? 'checked' : ''}/>
          <div class="slider"></div>
        </label>
      </div>
    `;
    container.appendChild(card);
  });
}

function attachListeners() {
  attachCheckboxListeners();
  attachRemoveListeners();
}

function attachCheckboxListeners() {
  const activationCheckboxes = document.querySelectorAll('.activityCheckbox');
  activationCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', (event) => {
      const card = event.target.closest('.extension-card');
      if (card) {
        const name = card.querySelector('h3').textContent;
        const extension = extensions.find(ext => ext.name === name);
        if (extension) {
          extension.isActive = event.target.checked;
          updatePage(); // Refresh the page after state change
        }
      }
    });
  });
}

function attachRemoveListeners() {
  const removeButtons = document.querySelectorAll('.remove-btn');
  removeButtons.forEach(button => {
    button.addEventListener('click', (event) => {
      const card = event.target.closest('.extension-card');
      if (card) {
        const name = card.querySelector('h3').textContent;
        extensions = extensions.filter(ext => ext.name !== name); // Remove the extension
        updatePage(); // Refresh the page after removal
      }
    });
  });
}

function updatePage() {
  renderExtensions(extensions); // Re-render the extensions
  attachListeners(); // Reattach listeners to the new elements
}

document.getElementById('show-all').addEventListener('click', () => {
  renderExtensions(extensions);
  attachListeners(); // Reattach listeners after rendering
});

document.getElementById('show-active').addEventListener('click', () => {
  const active = extensions.filter(ext => ext.isActive);
  renderExtensions(active);
  attachListeners(); // Reattach listeners after renderingt
});

document.getElementById('show-inactive').addEventListener('click', () => {
  const inactive = extensions.filter(ext => !ext.isActive);
  renderExtensions(inactive);
  attachListeners(); // Reattach listeners after rendering
});
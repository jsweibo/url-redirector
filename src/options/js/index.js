const configForm = document.querySelector('#config');
const statusInput = document.querySelector('#status');
const ruleInput = document.querySelector('#rule');
const hintField = document.querySelector('.hint-field');
const hintText = document.querySelector('.hint-field .hint');
let needSave = false;

function _reset() {
  needSave = false;
  browser.storage.local.clear().then(function () {
    location.reload();
  });
}

function getOptions() {
  return new Promise(function (resolve) {
    browser.storage.local
      .get('options')
      .then(function (res) {
        if (res.options) {
          resolve(JSON.parse(res.options));
        } else {
          resolve({});
        }
      })
      .catch(function (error) {
        console.log(error.message);
        resolve({});
      });
  });
}

function saveOptions(options) {
  return new Promise(function (resolve) {
    browser.storage.local
      .set({
        options: JSON.stringify(options),
      })
      .then(function () {
        resolve();
      })
      .catch(function (error) {
        console.log(error.message);
        resolve();
      });
  });
}

function notify({ type = '', message = '' }) {
  if (hintField.classList.length === 1) {
    hintText.textContent = message;
    if (type === 'success') {
      hintText.classList.add('hint_success');
      hintField.classList.add('hint-field_visible');
      setTimeout(function () {
        hintField.classList.remove('hint-field_visible');
        hintText.classList.remove('hint_success');
      }, 1e3);
    } else {
      hintText.classList.add('hint_error');
      hintField.classList.add('hint-field_visible');
      setTimeout(function () {
        hintField.classList.remove('hint-field_visible');
        hintText.classList.remove('hint_error');
      }, 1e3);
    }
  }
}

function l10n() {
  document.querySelector('title').textContent = browser.i18n.getMessage(
    'optionsPageTitle'
  );

  document.querySelector('#about h1').textContent = browser.i18n.getMessage(
    'extensionName'
  );

  document.querySelector('#status-title').textContent = browser.i18n.getMessage(
    'statusTitle'
  );

  document.querySelector('#rule-title').textContent = browser.i18n.getMessage(
    'ruleTitle'
  );

  ruleInput.placeholder = browser.i18n.getMessage('rulePlaceholder');

  document.querySelector('#submit').textContent = browser.i18n.getMessage(
    'submitForm'
  );
}

function start() {
  l10n();

  getOptions().then(function (options) {
    if ('status' in options) {
      document.querySelector('#status').checked = options.status;
    }
    if ('rule' in options && options.rule.length) {
      document.querySelector('#rule').value = JSON.stringify(options.rule);
    }
  });

  configForm.addEventListener('change', function () {
    needSave = true;
  });

  configForm.addEventListener('submit', function (event) {
    event.preventDefault();

    if (ruleInput.value) {
      // check rule syntax
      try {
        ruleInput.value = JSON.stringify(JSON.parse(ruleInput.value));
      } catch (error) {
        notify({
          type: 'error',
          message: browser.i18n.getMessage('errorHint'),
        });
        return;
      }
      // pass check, save options
      saveOptions({
        status: statusInput.checked,
        rule: JSON.parse(ruleInput.value),
      }).then(function () {
        notify({
          type: 'success',
          message: browser.i18n.getMessage('saveSuccessfullyHint'),
        });
        needSave = false;
      });
    } else {
      // save options
      saveOptions({
        status: statusInput.checked,
        rule: [],
      }).then(function () {
        notify({
          type: 'success',
          message: browser.i18n.getMessage('saveSuccessfullyHint'),
        });
        needSave = false;
      });
    }
  });

  window.addEventListener('beforeunload', function (event) {
    if (needSave) {
      event.preventDefault();
      event.returnValue = '';
    }
  });
}

window.addEventListener('DOMContentLoaded', start);

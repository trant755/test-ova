const formPageBody = document.querySelector(".form_page_body");
const mainForm = document.querySelector("#main-form");
const driversContainer = document.querySelector(".drivers-form__container");
const driversFormsWrapper = document.querySelector(".drivers-forms");
const generateBtn = document.querySelector("#generate-klopotannya");
const pidpusatuBtn = document.querySelector("#pidpusaty-klopoyanya");
const nubmerOfDrivers = document.querySelector('[name="driversCount"]');
const submitBtn = document.querySelector("#shlikh-submit");
const driversFilesForm = document.querySelector(".driver-files-form");
const pidpusanuyLustForm = document.querySelector(".pidpusanuy-lust-form");

const driverForm = driversFormsWrapper.innerHTML;

nubmerOfDrivers.addEventListener("change", (e) => {
  if (e.target.value < 1) {
    driversFormsWrapper.innerHTML = "";
    driversContainer.classList.add("display-none");
    return;
  }

  driversFormsWrapper.innerHTML = "";

  for (let i = 0; i < e.target.value; i++) {
    driversFormsWrapper.innerHTML += `<p style="margin-top: 32px">Водій номер ${
      i + 1
    }</p> ${driverForm}`;
  }

  driversContainer.classList.remove("display-none");
});

generateBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  const driversForm = document.querySelectorAll(".driver-form");

  const formData = new FormData(mainForm);
  const data = Object.fromEntries(formData.entries());

  const driversData = [];

  driversForm.forEach((form) => {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    driversData.push(data);
  });

  const result = {
    ...data,
    drivers: driversData,
  };

  try {
    const response = await fetch(
      "https://dopomoha.carpathia.gov.ua/api/api/shliakh/create-shliakh",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(result),
      }
    );

    //download file

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "klopotannya.pdf";
    document.body.appendChild(a);
    a.click();
    a.remove();

    URL.revokeObjectURL(url);
  } catch (error) {
    console.log(error.message);
  }
});

submitBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  // if (!checkForms()) {
  //   submitBtn.classList.add("disabled");
  //   return;
  // }

  const driversForm = document.querySelectorAll(".driver-form");

  const sendFormData = new FormData();

  const formData = new FormData(mainForm);
  const data = Object.fromEntries(formData.entries());

  const driversData = [];
  const files = [];

  driversForm.forEach((form) => {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    if (data.declarationFile.size > 2048) {
      files.push(data.declarationFile);
    }
    delete data.declarationFile;

    driversData.push(data);
  });

  const driversFiles = new FormData(driversFilesForm);
  const driversFilesData = Object.fromEntries(driversFiles.entries());
  if (driversFilesData.driversFiles.size > 2048) {
    files.push(driversFilesData.driversFiles);
  }

  const pidpusanuyLust = new FormData(pidpusanuyLustForm);
  const pidpusanuyLustData = Object.fromEntries(pidpusanuyLust.entries());
  if (pidpusanuyLustData.pidpusanuyLustFile.size > 2048) {
    files.push(pidpusanuyLustData.pidpusanuyLustFile);
  }

  const result = {
    ...data,
    drivers: JSON.stringify(driversData),
  };

  const resultEntries = Object.entries(result);

  resultEntries.forEach((entry) => {
    sendFormData.append(entry[0], entry[1]);
  });

  files.forEach((file) => {
    sendFormData.append("files", file);
  });

  try {
    const response = await fetch(
      "http://localhost:4080/api/shliakh/send-shliakh",
      {
        method: "POST",
        body: sendFormData,
      }
    );
  } catch (error) {
    console.log(error);
  }
});

formPageBody.addEventListener("input", (e) => {
  const parrent = e.target.closest(".shliakh-form__input-label");
  const errorMsg = parrent.querySelector(".input-error");

  if (checkFormsForGeneration()) {
    generateBtn.classList.remove("disabled");
    pidpusatuBtn.classList.remove("disabled");
  } else {
    generateBtn.classList.add("disabled");
    pidpusatuBtn.classList.add("disabled");
  }

  if (e.target.classList.contains("shliakh-form__input")) {
    if (!e.target.validity.valid) {
      errorMsg.textContent = e.target.title;
    } else {
      errorMsg.textContent = "";
    }
  }
});

formPageBody.addEventListener("change", (e) => {
  const parrent = e.target.closest(".shliakh-form__input-label");
  const errorMsg = parrent.querySelector(".input-error");

  if (e.target.type === "text") {
    e.target.value = e.target.value.trim().replace(/\s+/g, " ");
  }

  if (checkFormsForGeneration()) {
    generateBtn.classList.remove("disabled");
    pidpusatuBtn.classList.remove("disabled");
  } else {
    generateBtn.classList.add("disabled");
    pidpusatuBtn.classList.add("disabled");
  }

  if (!e.target.classList.contains("shliakh-form__input--file")) return;

  if (e.target.files.length < 1) return;

  const files = e.target.files;

  if (files[0].size < 2048) {
    e.target.setCustomValidity(`Файл ${files[0].name} занадто малий`);
    errorMsg.textContent = `Файл ${files[0].name} занадто малий`;
    e.target.value = "";
    return;
  } else {
    e.target.setCustomValidity("");
  }

  const addFIleElement = parrent.querySelector(".add-file");
  const fileAddedElement = parrent.querySelector(".file-added-wrapper");
  const fileNameElement = parrent.querySelector(".file-name");

  fileAddedElement.classList.remove("display-none");
  addFIleElement.classList.add("display-none");
  fileNameElement.textContent = files[0].name;
});

formPageBody.addEventListener("click", (e) => {
  if (e.target.classList.contains("input-delete-file")) {
    e.preventDefault();
    const parrent = e.target.closest(".shliakh-form__input-label");
    const addFIleElement = parrent.querySelector(".add-file");
    const fileAddedElement = parrent.querySelector(".file-added-wrapper");
    const input = parrent.querySelector(".shliakh-form__input--file");
    const fileNameElement = parrent.querySelector(".file-name");

    fileNameElement.textContent = "";
    addFIleElement.classList.remove("display-none");
    fileAddedElement.classList.add("display-none");
    input.value = "";
  }
});

//function ro check rhat all forms are valid and if not scroll to first invalid form

function checkForms() {
  const forms = document.querySelectorAll(".shliakh-form__input");

  for (let i = 0; i < forms.length; i++) {
    if (!forms[i].validity.valid) {
      forms[i].scrollIntoView({ block: "center", behavior: "smooth" });
      forms[i]
        .closest(".shliakh-form__input-label")
        .querySelector(".input-error").textContent = forms[i].title;
      return false;
    }
  }

  return true;
}

function checkFormsForGeneration() {
  const forms = document.querySelectorAll(".shliakh-form__input");

  for (let i = 0; i < forms.length; i++) {
    if (forms[i].name === "pidpusanuyLustFile") continue;
    console.log(i);
    console.log(forms.length);
    if (!forms[i].validity.valid) {
      return false;
    }
  }

  return true;
}

//remove all input values

function removeInputValues() {
  const inputs = document.querySelectorAll(".shliakh-form__input");

  inputs.forEach((input) => {
    input.value = "";
  });
}

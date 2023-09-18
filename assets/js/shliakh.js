const mainForm = document.querySelector("#main-form");
const driversContainer = document.querySelector(".drivers-form__container");
const driversFormsWrapper = document.querySelector(".drivers-forms");
const generateBtn = document.querySelector("#generate-klopotannya");
const pidpusatuBtn = document.querySelector("#pidpusaty-klopoyanya");
const nubmerOfDrivers = document.querySelector('[name="drivers-count"]');
console.log(123);
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
  console.log("generate");
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

  const response = fetch(
    "http://192.168.0.103:4080/api/shliakh/create-shliakh",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(result),
    }
  );
});

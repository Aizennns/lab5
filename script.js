let profileData = null;

async function loadProfileData() {
  try {
    const response = await fetch('data.json');
    profileData = await response.json();
    renderProfile(profileData);
    loadFromLocalStorage();
  } catch (error) {
    console.error('Məlumat yüklənərkən xəta:', error);
  }
}

function renderProfile(data) {
  // Kontakt
  document.getElementById("contact-phone").textContent = data.contact.phone;
  document.getElementById("contact-email").textContent = data.contact.email;
  document.getElementById("contact-address").textContent = data.contact.address;
  document.getElementById("contact-website").textContent = data.contact.website;

  // Təhsil
  const educationList = document.getElementById("educationList");
  educationList.innerHTML = '';
  data.education.forEach((edu, i) => {
    educationList.appendChild(createEditableField('education', i, edu));
  });

  // Bacarıqlar
  const skillsList = document.getElementById("skillsList");
  skillsList.innerHTML = '';
  data.skills.forEach((skill, i) => {
    skillsList.appendChild(createEditableField('skill', i, skill));
  });

  // Dillər
  const languagesList = document.getElementById("languagesList");
  languagesList.innerHTML = '';
  data.languages.forEach(lang => {
    const li = document.createElement("li");
    li.textContent = lang;
    languagesList.appendChild(li);
  });

  // About
  document.getElementById("name").value = data.profile.name;
  document.getElementById("email").value = data.profile.email;
  document.getElementById("date").value = data.profile.birthDate;
  document.getElementById("profile-description").value = data.profile.description;
  document.getElementById("profile-name").textContent = data.profile.name;

  // İş təcrübəsi
  const workExperience = document.getElementById("workExperience");
  workExperience.innerHTML = '';
  data.profile.workExperience.forEach((work, i) => {
    workExperience.appendChild(createEditableField('work', i, work));
  });

  // Referanslar
  document.getElementById("reference-1").textContent = data.profile.references[0];
  document.getElementById("reference-2").textContent = data.profile.references[1];
}

function createEditableField(type, index, value) {
  const container = document.createElement('div');
  container.className = 'editable-field';

  const span = document.createElement('span');
  span.textContent = value;
  span.id = `${type}-${index}-text`;

  const editBtn = document.createElement('button');
  editBtn.textContent = 'Düzəliş et';
  editBtn.onclick = () => switchToEditMode(type, index);

  container.appendChild(span);
  container.appendChild(editBtn);

  return container;
}

function switchToEditMode(type, index) {
  const span = document.getElementById(`${type}-${index}-text`);
  const currentValue = span.textContent;

  const input = document.createElement('input');
  input.type = 'text';
  input.value = currentValue;
  input.id = `${type}-${index}-input`;

  const saveBtn = document.createElement('button');
  saveBtn.textContent = 'Yadda saxla';
  saveBtn.onclick = () => saveEdit(type, index);

  const parent = span.parentElement;
  parent.innerHTML = '';
  parent.appendChild(input);
  parent.appendChild(saveBtn);
}

function saveEdit(type, index) {
  const input = document.getElementById(`${type}-${index}-input`);
  const newValue = input.value.trim();
  if (!newValue) {
    alert('Dəyər boş ola bilməz!');
    return;
  }

  switch (type) {
    case 'education':
      profileData.education[index] = newValue;
      break;
    case 'skill':
      profileData.skills[index] = newValue;
      break;
    case 'work':
      profileData.profile.workExperience[index] = newValue;
      break;
  }

  renderProfile(profileData);
  saveToLocalStorage();
}

function addNewItem(type) {
  let inputId, errorId, arr;

  switch (type) {
    case 'education':
      inputId = 'newEducation';
      errorId = 'educationError';
      arr = profileData.education;
      break;
    case 'skill':
      inputId = 'newSkill';
      errorId = 'skillError';
      arr = profileData.skills;
      break;
    case 'work':
      inputId = 'newWork';
      errorId = 'workError';
      arr = profileData.profile.workExperience;
      break;
  }

  const newValue = document.getElementById(inputId).value.trim();
  const errorDiv = document.getElementById(errorId);

  if (!newValue) {
    errorDiv.textContent = 'Zəhmət olmasa boş buraxmayın.';
    return;
  }

  arr.push(newValue);
  document.getElementById(inputId).value = '';
  errorDiv.textContent = '';

  renderProfile(profileData);
  saveToLocalStorage();
}

function saveToLocalStorage() {
  // Validasiya
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const date = document.getElementById("date").value;
  const description = document.getElementById("profile-description").value.trim();

  let isValid = true;

  if (!name) {
    document.getElementById("nameError").textContent = "Ad tələb olunur.";
    isValid = false;
  } else {
    document.getElementById("nameError").textContent = "";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    document.getElementById("emailError").textContent = "Etibarlı e-poçt daxil edin.";
    isValid = false;
  } else {
    document.getElementById("emailError").textContent = "";
  }

  if (!date) {
    document.getElementById("dateError").textContent = "Tarix tələb olunur.";
    isValid = false;
  } else {
    document.getElementById("dateError").textContent = "";
  }

  if (description.length < 10) {
    document.getElementById("profileError").textContent = "Profil təsviri minimum 10 simvol olmalıdır.";
    isValid = false;
  } else {
    document.getElementById("profileError").textContent = "";
  }

  if (!isValid) return;

  // Modeli yenilə
  profileData.profile.name = name;
  profileData.profile.email = email;
  profileData.profile.birthDate = date;
  profileData.profile.description = description;

  document.getElementById("profile-name").textContent = name;

  localStorage.setItem('profileData', JSON.stringify(profileData));
  alert('Məlumatlar yadda saxlanıldı!');
}

function loadFromLocalStorage() {
  const savedData = localStorage.getItem('profileData');
  if (savedData) {
    profileData = JSON.parse(savedData);
    renderProfile(profileData);
  }
}

function resetAll() {
  if (confirm('Bütün məlumatlar silinəcək, davam etmək istəyirsiniz?')) {
    localStorage.removeItem('profileData');
    loadProfileData();
  }
}

function toggleSection(id) {
  const section = document.getElementById(id);
  if (section.style.display === "none" || section.style.display === "") {
    section.style.display = "block";
  } else {
    section.style.display = "none";
  }
}

window.onload = function () {
  loadProfileData();

  document.getElementById('resetBtn').onclick = resetAll;
};
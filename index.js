// Initialize Firebase
const firebaseConfig = {

    apiKey: "AIzaSyB_TPiDT7OQrMiWNxUGAfRW1SjlfUubH2I",

    authDomain: "examen-lmsg-vanillajs.firebaseapp.com",

    projectId: "examen-lmsg-vanillajs",

    storageBucket: "examen-lmsg-vanillajs.appspot.com",

    messagingSenderId: "345828510665",

    appId: "1:345828510665:web:84c6b889292b52de6b7618",

    measurementId: "G-K60LP7CQMX"

};
firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();

document.getElementById('addStudentForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const name = document.getElementById('studentName').value;
    const surname = document.getElementById('studentSurname').value;
    const dni = document.getElementById('studentDni').value;
    const phone = document.getElementById('studentPhone').value;

    if (!name || !surname || !dni || !phone) {
        alert('Todos los campos son obligatorios y deben cumplir con el formato especificado.');
        return;
    }

    addStudent(name, surname, dni, phone);
    document.getElementById('studentName').value = '';
    document.getElementById('studentSurname').value = '';
    document.getElementById('studentDni').value = '';
    document.getElementById('studentPhone').value = '';
});

function addStudent(name, surname, dni, phone) {
    db.collection("students").add({
        name: name,
        surname: surname,
        dni: dni,
        phone: phone,
        present: false
    })
    .then(function(docRef) {
        console.log("Document written with ID: ", docRef.id);
        addStudentRow(docRef.id, name, surname, dni, phone, false); // Add row to the table with Firestore document ID
    })
    .catch(function(error) {
        console.error("Error adding document: ", error);
    });
}

function addStudentRow(id, name, surname, dni, phone, present) {
    const studentList = document.getElementById('studentList');
    const row = studentList.insertRow();
    row.setAttribute('data-id', id); // Set document ID as an attribute for easy access

    const avatarCell = row.insertCell(0);
    const nameCell = row.insertCell(1);
    const surnameCell = row.insertCell(2);
    const dniCell = row.insertCell(3);
    const phoneCell = row.insertCell(4);
    const actionCell = row.insertCell(5);

    const avatar = document.createElement('img');
    avatar.src = `https://api.multiavatar.com/${encodeURIComponent(name)}.png`;
    avatar.classList.add('img-fluid');
    avatar.style.maxWidth = '50px';
    avatarCell.appendChild(avatar);

    nameCell.textContent = name;
    surnameCell.textContent = surname;
    dniCell.textContent = dni;
    phoneCell.textContent = phone;

    if (present) {
        row.classList.add('table-success');
    }

    // Delete Button with SVG
    const deleteButton = document.createElement('button');
    deleteButton.className = 'btn btn-danger';
    deleteButton.innerHTML = `<img src="https://www.svgrepo.com/show/533010/trash-alt.svg" alt="Delete" style="width: 20px; height: 20px;">`;
    deleteButton.onclick = function() { deleteStudent(id, row); };

    // Present Button with SVG
    const presentButton = document.createElement('button');
    presentButton.className = 'btn btn-success ml-2';
    presentButton.innerHTML = `<img src="https://www.svgrepo.com/show/522795/clipboard-check.svg" alt="Present" style="width: 20px; height: 20px;">`;
    presentButton.onclick = function() { markAsPresent(id, row); };

    actionCell.appendChild(deleteButton);
    actionCell.appendChild(presentButton);
}

function loadStudents() {
    db.collection("students").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const student = doc.data();
            addStudentRow(doc.id, student.name, student.surname, student.dni, student.phone, student.present);
        });
    });
}

function deleteStudent(id, row) {
    db.collection("students").doc(id).delete().then(function() {
        console.log("Document successfully deleted!");
        row.remove(); // Remove row from the table
    }).catch(function(error) {
        console.error("Error removing document: ", error);
    });
}

function markAsPresent(id, row) {
    db.collection("students").doc(id).update({
        present: true
    }).then(function() {
        console.log("Document successfully updated!");
        row.classList.add('table-success');
    }).catch(function(error) {
        console.error("Error updating document: ", error);
    });
}

window.onload = loadStudents;

const taskList = document.querySelector('#task-list');
const form = document.querySelector('#add-task-form');

// create element & render cafe
function renderTask(doc) {
    let li = document.createElement('li');
    let taskName = document.createElement('span');
    let taskTime = document.createElement('span');
    let cross = document.createElement('div');

    li.setAttribute('data-id', doc.id);
    taskName.textContent = doc.data().taskName;
    taskTime.textContent = doc.data().taskTime;
    cross.textContent = '❌';

    li.appendChild(taskName);
    li.appendChild(taskTime);
    li.appendChild(cross);

    taskList.appendChild(li);

    // deleting data
    cross.addEventListener('click', (e) => {
        e.stopPropagation();
        let id = e.target.parentElement.getAttribute('data-id');
        db.collection('tasks').doc(id).delete();
    });
}

// getting data
// db.collection('tasks').get().then(snapshot => {
//     snapshot.docs.forEach(doc => {
//         renderCafe(doc);
//     });
// });

// saving data
form.addEventListener('submit', (e) => {
    e.preventDefault();
    db.collection('tasks').add({
        taskName: form.taskName.value,
        taskTime: form.taskTime.value
    });
    form.taskName.value = '';
    form.taskTime.value = '';
});

// // real-time listener
db.collection('tasks').orderBy('taskTime').onSnapshot(snapshot => {
    let changes = snapshot.docChanges();
    changes.forEach(change => {
        // console.log(change.doc.data());
        if (change.type == 'added') {
            renderTask(change.doc);
        } else if (change.type == 'removed') {
            let li = taskList.querySelector('[data-id=' + change.doc.id + ']');
            taskList.removeChild(li);
        }

    });
});
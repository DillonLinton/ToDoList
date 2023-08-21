async function addTask() {
    const taskText = document.getElementById('new-task').value;
    if (taskText.trim()) {
      const res = await fetch('/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ task: taskText }),
      });
      const task = await res.json();
      displayTask(task);
    }
  }
  
  function displayTask(task) {
    const list = document.getElementById('todo-list');
    const listItem = document.createElement('li');
    listItem.classList.add('task');
    listItem.textContent = task.text;
    
    // Add delete button to each task
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.onclick = async function() {
      await deleteTask(task.id);
    };
    listItem.appendChild(deleteButton);
  
    list.appendChild(listItem);
  }
  
  async function getTasks() {
    const res = await fetch('/tasks');
    const tasks = await res.json();
    tasks.forEach((task) => {
      displayTask(task);
    });
  }
  
  async function deleteTask(taskId) {
    await fetch(`/tasks/${taskId}`, {
      method: 'DELETE',
    });
    const taskList = document.getElementById('todo-list');
    taskList.innerHTML = '';
    getTasks();
  }
  
  // Listen for Enter key to submit tasks
  document.getElementById('new-task').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      addTask();
    }
  });
  
  getTasks();  
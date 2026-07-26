const taskbox = document.getElementById("task-box");
const addtask = document.getElementById("add");
const removetask = document.getElementById("rem");
const hidetask = document.getElementById("hide");
const status = document.getElementById("status");
const percent = document.getElementById("percent");
const remaining = document.getElementById("remaining");
const main = document.getElementById("main");
const parent = document.getElementById("parent");
const bottom = document.getElementById("bottom");
const hidebutton = document.getElementById("hide");
const buttonsection = document.getElementById("button-section");
let tasks = [];

const emptyState = document.getElementById("empty-state");
const hiddenstate = document.getElementById("hidden-state");
hiddenstate.style.display = "none";

const savedTasks = localStorage.getItem("tasks");
if (savedTasks) {
    tasks = JSON.parse(savedTasks);
}

updateUI();
updateEmptyState();

tasks.forEach(
    taskobject => {
        taskrenderer(taskobject);
    }
)

function taskrenderer(taskobject) {
    const task = document.createElement("div");
    task.classList.add("task");
    task.dataset.id = taskobject.id;
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.classList.add("checkbox");
    checkbox.checked = taskobject.isdone;
    checkbox.addEventListener("change", function () {
        if (checkbox.checked) {
            taskobject.isdone = true;
            saveTasks();
            updateUI();
            }
        else {
            taskobject.isdone = false;
            saveTasks();
            updateUI();
            }
    });
    const label = document.createElement("label");
    label.textContent = taskobject.name;
    label.classList.add("name");
    task.appendChild(checkbox);
    task.appendChild(label);
    taskbox.appendChild(task);
}

function updateUI() {

    const total = tasks.length;
    const finished = tasks.filter(task => task.isdone).length;

    status.textContent = `Finished: ${finished}/${total}`;

    remaining.textContent = `Remaining Tasks: ${total - finished}`;

    percent.textContent =
        total === 0
        ? "Percentage Completion: 0%"
        : `Percentage Completion: ${((finished / total) * 100).toFixed(2)}%`;
}


function updateEmptyState() {
    if (tasks.length === 0) {
        emptyState.style.display = "block";
    } else {
        emptyState.style.display = "none";
    }
}
function updateHiddenState() {
    const visibleTasks = taskbox.querySelectorAll(".task:not([style*='display: none'])");
    if(visibleTasks.length === 0) {
        hiddenstate.style.display = "block";
    } else {
       hiddenstate.style.display = "none";
    }
}

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

addtask.addEventListener("click", function () {
    removetask.disabled = true;
    hidetask.disabled = true;
    addtask.disabled = true;
    emptyState.style.display = "none";
    const task = document.createElement("div");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.classList.add("checkbox");
    task.classList.add("task");
    task.appendChild(checkbox);
    let inputbox = document.createElement("input");
    inputbox.type = "text";
    inputbox.placeholder = "Enter your task";
    inputbox.classList.add("task-input");
    task.appendChild(inputbox);
    const okay = document.createElement("button");
    okay.textContent = "OK";
    okay.classList.add("okay-button");
    task.appendChild(okay);
    const cancel = document.createElement("button");
    cancel.textContent = "CANCEL";
    cancel.classList.add("cancel-button");
    task.appendChild(cancel);

    cancel.addEventListener("click", function () {
        taskbox.removeChild(task);
        addtask.disabled = false;
        removetask.disabled = false;
        hidetask.disabled = false;
        updateEmptyState();

    });


    function savetask(){
        const taskText = inputbox.value.trim();
        if (taskText !== "") {
            task.removeChild(inputbox);
            task.removeChild(okay);
            task.removeChild(cancel);
            task.removeChild(checkbox);
            const taskObject = {
                name: taskText,
                isdone: false,
                id: crypto.randomUUID()
            };

            tasks.push(taskObject);
            saveTasks();
            updateEmptyState();
            addtask.disabled = false;
            removetask.disabled = false;
            hidetask.disabled = false;
            updateUI();
            taskrenderer(taskObject);
            task.remove();
            
        }
    }

    okay.addEventListener("click", savetask);

    inputbox.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
           savetask();
        }
    });
    taskbox.appendChild(task);
    inputbox.focus();
});




removetask.addEventListener("click", function () {
    if (taskbox.querySelectorAll(".task").length === 0) {
        alert("No tasks to remove");
        return;
    }
    addtask.disabled = true;
    removetask.disabled = true;
    hidetask.disabled = true;
    taskbox.querySelectorAll(".task").forEach(
        child => {
            const deletebox = document.createElement("input");
            deletebox.type = "checkbox";
            deletebox.classList.add("deletebox");
            child.appendChild(deletebox);
        }
    )
    const delete_msg = document.createElement("span");
    delete_msg.textContent = "Choose the tasks you want to delete";
    delete_msg.style.color = "white";
    taskbox.appendChild(delete_msg);
    const confirm_button = document.createElement("button");
    confirm_button.classList.add("confirm");
    confirm_button.textContent = "Confirm";
    parent.insertBefore(confirm_button, bottom);
    confirm_button.addEventListener("click", function () {
        taskbox.querySelectorAll(".task").forEach(
            child => {
                const id = child.dataset.id;
                const deletebox = child.querySelector(".deletebox");
                if (deletebox && deletebox.checked) {
                    taskbox.removeChild(child);
                    tasks = tasks.filter(task => task.id !== id);
                    saveTasks();
                    updateEmptyState(); 
                }

            }
        )
        updateUI();
        taskbox.querySelectorAll(".deletebox").forEach(deletebox => {
            deletebox.remove();
        });
        taskbox.removeChild(delete_msg);
        parent.removeChild(confirm_button);
        parent.removeChild(cancel_button);
        addtask.disabled = false;
        removetask.disabled = false;
        hidetask.disabled = false;
    })
    const cancel_button = document.createElement("button");
    cancel_button.classList.add("cancel");
    cancel_button.textContent = "Cancel";
    parent.insertBefore(cancel_button, bottom);
    cancel_button.addEventListener("click", function () {
        
        
        addtask.disabled = false;
        removetask.disabled = false;
        hidetask.disabled = false;

        taskbox.querySelectorAll(".deletebox").forEach(deletebox => {
            deletebox.remove();
        });
        taskbox.removeChild(delete_msg);
        parent.removeChild(confirm_button);
        parent.removeChild(cancel_button);
        addtask.disabled = false;
        removetask.disabled = false;
        hidetask.disabled = false;
    })   
    
    
})


hidetask.addEventListener("click", function () {
    if (taskbox.querySelectorAll(".task").length === 0) {
        alert("No tasks to hide");
        return;
    }
    if (taskbox.querySelectorAll(".task").length === taskbox.querySelectorAll(".task[style*='display: none']").length) {
        alert("All tasks are already hidden");
        return;
    }
    addtask.disabled = true;
    removetask.disabled = true;
    hidetask.disabled = true;
    let ishidden = false;
    taskbox.querySelectorAll(".task").forEach(child => {
            const checkbox = child.querySelector(".checkbox")
            if (checkbox.checked) {
                child.style.display = "none";
                if (!ishidden) {
                    hidebutton.style.display = "none";
                    const showbutton = document.createElement("button");
                    showbutton.textContent = "Show All Tasks";
                    showbutton.style.display = "block";
                    showbutton.style.color = "white";
                    showbutton.style.backgroundColor = "blue";
                    showbutton.style.border = "none";
                    showbutton.style.padding = "10px 20px";
                    showbutton.style.fontSize = "16px";
                    buttonsection.appendChild(showbutton);
                    showbutton.addEventListener("click", function () {
                        taskbox.querySelectorAll(".task").forEach(child => {
                            child.style.display = "flex";
                            updateHiddenState();
                        });
                        buttonsection.removeChild(showbutton);
                        addtask.disabled = false;
                        removetask.disabled = false;
                        hidetask.disabled = false;
                        hidebutton.style.display = "block";
                    });
                    ishidden = true;
                }
            }
        
    });
    addtask.disabled = false;
    removetask.disabled = false;
    hidetask.disabled = false;
    updateHiddenState();

});
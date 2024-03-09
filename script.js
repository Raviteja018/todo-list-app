//selectors

const todoInput = document.querySelector(".todo-input");
const todoBtn = document.querySelector(".todo-btn");
const todoList = document.querySelector(".todo-list");
const todoFilter = document.querySelector(".filter")

console.log(todoInput, todoBtn, todoList);

//EventListeners
document.addEventListener('DOMContentLoaded',getTodos)
todoBtn.addEventListener("click", addToDo);
todoList.addEventListener("click", handleTaskActions);
todoFilter.addEventListener("click", filterTask);


//function to add div and append the added elements into it

function addToDo(event){
    event.preventDefault();
    
     // Check if the input is not empty
     if (!todoInput.value.trim()) {
        alert("Please enter a valid todo");
        return;
    }

    //creating todo div
    const todoDiv = document.createElement('div');
    todoDiv.classList.add('todo');

    //creating li items to insert into todo div
    const newTodo = document.createElement('li');
    newTodo.innerText = todoInput.value;
    newTodo.classList.add('todo-item'); 
    todoDiv.appendChild(newTodo);

    //adding Todo to local storage
    saveLocalTodos(todoInput.value);

    // creating edit button to insert into todo div
    const editButton = document.createElement("button");
    editButton.innerHTML = '<i class="fa fa-pencil"></i>';
    editButton.classList.add("edit-btn");
    todoDiv.appendChild(editButton);

    //creating completed button to insert into todo div
    const completeButton = document.createElement('button');
    completeButton.innerHTML = '<i class="fa fa-check"></i>'; 
    completeButton.classList.add('complete-btn');
    todoDiv.appendChild(completeButton);

    //creating delete button to insert into todo div
    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = '<i class="fa fa-trash">';
    deleteButton.classList.add('delete-btn');
    todoDiv.appendChild(deleteButton);

    //inserting todo div into ul with class name todoList
    todoList.appendChild(todoDiv);

    //to clear the input value after entering
    todoInput.value ="";

}

    //function to delete the task

    function handleTaskActions(e){
        const item = e.target;
        // console.log(e.target)
        //deleting tasks given by user
        if(item.classList.contains("delete-btn")){
            const todoItem = item.parentElement;
            removeLocalTodos(todoItem); 
            todoItem.remove();
        }

        // Check if the edit button is clicked
         if (item.classList.contains("edit-btn")) {
             editTask(e);
        }

        //marking as complete 
        if(item.classList.contains("complete-btn")){
            const todoItem = item.parentElement;
            // console.log(todoItem)
            todoItem.classList.toggle("completed");
        }

    }

    //function to filter todo tasks
    function filterTask(e){
        const todos = todoList.childNodes;
        todos.forEach(function(todo){
            switch(e.target.value){
                case "all":
                    todo.style.display = "flex";
                    break;
                case "completed":
                    if(todo.classList.contains("completed")){
                        todo.style.display = "flex";
                    }
                    else {
                        todo.style.display = "none";
                    }
                    break;
                case "pending":
                    if(!todo.classList.contains("completed")){
                        todo.style.display = "flex";
                    }else{
                        todo.style.display = "none";
                    }
                    break;
            }
        });

    }


    function saveLocalTodos(todo){
        let todos;
        if (localStorage.getItem('todos') === null){
            todos = [];
            }else{
                todos = JSON.parse(localStorage.getItem('todos'));
            }
                todos.push(todo);
                localStorage.setItem('todos',JSON.stringify(todos));
    }

    function getTodos() {
        let todos;
        if (localStorage.getItem('todos') === null) {
            todos = [];
        } else {
            todos = JSON.parse(localStorage.getItem('todos'));
        }
        todos.forEach(function (todo) {
            // creating todo div
            const todoDiv = document.createElement('div');
            todoDiv.classList.add('todo');
    
            // creating li items to insert into todo div
            const newTodo = document.createElement('li');
            newTodo.innerText = todo;
            newTodo.classList.add('todo-item');
            todoDiv.appendChild(newTodo);
    
            // creating completed button to insert into todo div
            const completeButton = document.createElement('button');
            completeButton.innerHTML = '<i class="fa fa-check"></i>';
            completeButton.classList.add('complete-btn');
            todoDiv.appendChild(completeButton);
    
            // creating edit button to insert into todo div
            const editButton = document.createElement("button");
            editButton.innerHTML = '<i class="fa fa-pencil"></i>';
            editButton.classList.add("edit-btn");
            todoDiv.appendChild(editButton);
    
            // creating delete button to insert into todo div
            const deleteButton = document.createElement('button');
            deleteButton.innerHTML = '<i class="fa fa-trash">';
            deleteButton.classList.add('delete-btn');
            todoDiv.appendChild(deleteButton);
    
            // inserting todo div into ul with class name todoList
            todoList.appendChild(todoDiv);
        });
    }
    
    function removeLocalTodos(todo){
        let todos;
        if(localStorage.getItem("todos") === null){
            todos = [];
        }else{
            todos = JSON.parse(localStorage.getItem("todos"));
        }
        const todoIndex = todo.children[0].innerHTML;
        todos.splice(todos.indexOf(todoIndex),1);
        localStorage.setItem("todos",JSON.stringify(todos));
    }
     
    function updateLocalTodos(todoItem, newText) {
        let todos;
        if (localStorage.getItem("todos") === null) {
            todos = [];
        } else {
            todos = JSON.parse(localStorage.getItem("todos"));
        }
    
        const todoIndex = Array.from(todoList.children).indexOf(todoItem);
        
        // Update the text in the local storage array
        todos[todoIndex] = newText;
    
        localStorage.setItem("todos", JSON.stringify(todos));
    }

    function editTask(e) {
        const item = e.target;
    
        // Check if the edit button is clicked
        if (item.classList.contains("edit-btn")) {
            const todoItem = item.parentElement;
            const todoText = todoItem.querySelector(".todo-item");
    
            // Save the original text for comparison
            const originalText = todoText.innerText;
    
            // Make the todo text editable
            todoText.contentEditable = true;
            todoText.focus();
    
            // Add a keydown event listener to save changes on pressing Enter
            function handleKeyDown(event) {
                if (event.key === "Enter") {
                    event.preventDefault();
                    todoText.contentEditable = false;
                    todoText.blur();
                    const newText = todoText.innerText;
                    if (newText !== originalText) {
                        updateLocalTodos(todoItem, newText);
                    }
                    removeEventListeners();
                }
            }
    
            // Add a blur event listener to save changes on losing focus
            function handleBlur() {
                todoText.contentEditable = false;
                const newText = todoText.innerText;
                if (newText !== originalText) {
                    updateLocalTodos(todoItem, newText);
                }
                removeEventListeners();
            }
    
            // Helper function to remove event listeners
            function removeEventListeners() {
                todoText.removeEventListener("keydown", handleKeyDown);
                todoText.removeEventListener("blur", handleBlur);
            }
    
            todoText.addEventListener("keydown", handleKeyDown);
            todoText.addEventListener("blur", handleBlur);
        }
    }

    
    

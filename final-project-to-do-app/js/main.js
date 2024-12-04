/**
 * Setup our Database
 * @todo Replace ? with the correct DB name
 */
const db = new Dexie('ToDoList'); //create new database called ToDoList

/**
 * Define the tasks table
 * @todo: Add the correct fields to our table
 */
db.version(1).stores({
    tasks: '++id, name, isDone' //++id so that the id will increment
});

// Reference to the toast message <ion-toast>
const toast = document.querySelector('ion-toast')

// Get the <form> tag
const form = document.querySelector('form')

// Get the <ion-input> element
const input = document.querySelector("ion-input#task")

// Get the list item container
const list = document.querySelector('ion-list#task-list')


// Listen for "submit" event. I.e., User presses enter or clicks button.
form.addEventListener('submit', (event)=> {

    // Get the current value of the input field
    let taskName = input.value.trim()

    // If the taskName entered isn't blank...
    if(taskName !== ''){

        // Try to add the task to our database
        db.tasks.add({

            // Task Name
            name: taskName,
            isDone: false

        // It worked. Now we have the ID of the task
        }).then((id) =>{

            console.info(`Task added to table (tasks) with an ID of ${id}`)

            // Reset the form (clear out the user input)
            form.reset()
 
            // Task added! Show the toast message!
            toast.present();
        })
    }

    // Don't reload the page. This is a single page app
    event.preventDefault()
})

// Listen for database changes
Dexie.on("storagemutated", () => {
    // The database has changed. Update the HTML
    updateList()
});

/**
 * Updates the list of To Do Items on our page
 */
function updateList(){

    // Clear out old task list
    list.innerHTML = ''

    // Retrieve all tasks from the database
    db.tasks.reverse().toArray().then(tasks => {

        // Loop over the array of tasks, one task at a time
        tasks.forEach(task => {
            
            // For each task, create a new list item
            let listItem = `                
            <ion-item>
                  <ion-label onClick="db.tasks.update(${task.id}, { isDone: !${task.isDone}})">
                    <ion-checkbox justify="start" label-placement="end" checked="${task.isDone}">
                      ${task.name}
                    </ion-checkbox>
                  </ion-label>
                  <ion-toolbar>
                  <ion-buttons slot="secondary">
                    <ion-button onClick="db.tasks.delete(${task.id})"> 
                        <ion-icon slot="icon-only" name="trash-outline"></ion-icon>
                    </ion-button>
                    </ion-buttons>
                    </ion-toolbar>
                </ion-item>
            `
            // Add the list item html to our page
            list.innerHTML += listItem
        });
    })

}

/**
 * Run this code as soon as the page is loaded
 * @todo Add updateList()
 */
document.addEventListener('DOMContentLoaded', () =>{
    // The page has just finished loading in the browser. Now what?
    updateList();
})

//Once the DOM / page has loaded, immediately run the updateList() function to retrieve all the items from the database.
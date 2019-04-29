const handleNote = (e) => {
    e.preventDefault();
    
    $("#noteMessage").animate({width: 'hide'},350);
    if($("#noteTitle").val() == '' || $("noteDesc").val() == '' || $("noteDiffLevel").val() == '' || $("noteDueTime").val() == '' || $("noteDueDate").val() == '' || $("noteFinished").val() == ''){
        handleError("All fields are required");
        return false;
    }
    
    sendAjax('POST', $("#noteForm").attr("action"), $("#noteForm").serialize(), function(){
        loadNotesFromServer();
    });
    return false;
};

const NoteForm = (props) =>{
    return(
        <div>
        <form id="noteForm"
            onSubmit={handleNote}
            name="noteForm"
            action="/maker"
            method="POST"
            className="noteForm"
        >
        <label htmlFor="title">Title: </label>
        <input className="noteTitle" type="text" name="title" placeholder="Note Title"/>
        <br />
        <label htmlFor="desc">Description: </label>
        <textarea className="noteDesc" type="text" name="desc" placeholder="Note Description"/>
        <br />
        <label htmlFor="diffLevel">Difficulty Level: </label>
        <input className="noteDiffLevel" type="number"  min="0" max="5" name="diffLevel" placeholder="Task difficulty"/>
        <br />
        <label htmlFor="dueDate">Due date: </label>
        <input className="noteDueDate" type="date" name="dueDate" placeholder="Note Description"/>
        <br />
        <label htmlFor="dueTime">Time due: </label>
        <input className="noteDueTime" type="time" name="dueTime" placeholder="Note Description"/>
        <br />
        <input className="noteFinished" type="hidden" name="noteFinished" value="false"/>
        <input type="hidden" name="_csrf" value={props.csrf}/>
        <input className="makeNoteSubmit" type="submit" value="Make Note"/>
        </form>
        <div id="filters">
        <label htmlFor="sort">Sort By:</label>
        <select className="sort">
          <option value="dueSoonest">Due Soonest</option>
          <option value="diffLowHigh">Diff Low-High</option>
          <option value="diffHighLow">Diff High-Low</option>
        </select>
        
        <label htmlFor="tasks">Task Type:</label>
        <select className="task">
          <option value="allTasks">All Tasks</option>
          <option value="completedTasks">Completed Tasks</option>
          <option value="incompleteTasks">Incomplete Tasks</option>
        </select>
        
        </div>
        </div>
    );
};




const NoteList = function(props){
    if(props.notes.length === 0){
        return(
        <div className="noteList">
            <h3 className="emptyNote">No Notes yet</h3>    
        </div>
        );
    }
    const noteNodes = props.notes.map(function(note){
        var d = new Date(note.dueDate);
        if(note.noteFinished == true){
           return(
            <div key={note._id} id={note._id} className="note">
                <h3 className="noteEdit">Edit</h3>
                <h3 className="noteTitle">Title: {note.title}</h3>
            
                <h3 className="noteDesc">Description: {note.desc}</h3>
                <h3 className="noteDiffLevel">Difficulty: {note.diffLevel}</h3>
                <h3 className="noteDueDate">Due Date: {d.toDateString()}</h3>
                <h3 className="noteDueTime">Due Time: {note.dueTime}</h3>
                <h3 className="noteFinished">Finished?:</h3>
                <input className="noteFinished" type="checkbox" name="finished" checked/>
            </div> 
            ); 
        }
        else if (note.noteFinished == false){
             return(
            <div key={note._id} id={note._id} className="note">
                <h3 className="noteEdit">Edit</h3>
                <h3 className="noteTitle">Title: {note.title}</h3>
            
                <h3 className="noteDesc">Description: {note.desc}</h3>
                <h3 className="noteDiffLevel">Difficulty: {note.diffLevel}</h3>
                <h3 className="noteDueDate">Due Date: {d.toDateString()}</h3>
                <h3 className="noteDueTime">Due Time: {note.dueTime}</h3>
                <h3 className="noteFinished">Finished?:</h3>
                <input className="noteFinished" type="checkbox" name="finished"/>
            </div> 
        );                         
        }
        
    });
    
    return(
        <div className="noteList">
            <h1>All Notes</h1>
            {noteNodes}
        </div>
    );
};
const loadNotesFromServer = () =>{
    sendAjax('GET', '/getNotes', null, (data) =>{
       ReactDOM.render(
        <NoteList notes={data.notes}/>, document.querySelector("#notes")
       );
    });
};



const setup = function(csrf) {
    ReactDOM.render(
        <NoteForm csrf={csrf}/>, document.querySelector("#makeNote")
    );
    ReactDOM.render(
        <NoteList notes={[]}/>, document.querySelector("#notes")
    );
    
    //Event bubbling to make edit links trigger Note Edit mode
    //For now it just deletes the note
    document.addEventListener('click', function (event) {
    if ( event.target.classList.contains( 'noteEdit' ) ) {
        event.preventDefault();
        //let noteId = event.target.parentElement.id;
        getEditToken();
        
    }
}, false);
    
    //Delete account button
    document.addEventListener('click', function (event) {
    if ( event.target.classList.contains( 'accountDelete' ) ) {
        event.preventDefault();
        
        getDAToken();
        
    }
}, false);
    
    //Change Finished Status
    document.addEventListener('click', function (event) {
    if ( event.target.classList.contains( 'noteFinished' ) ) {
        currentId = event.target.parentElement.id;
        ReactDOM.render(
        <NoteFinishedForm csrf={csrf}/>, document.querySelector("#hiddenData")
    );
    handleFinishedNote();    
    }
    }, false);
                
    document.addEventListener('change', function (event) {
    if ( event.target.classList.contains( 'sort' ) ) {
                /*
                */
                switch(event.target.value){
                    case "dueSoonest":
                        sendAjax('GET', '/getNotes', null, (data) =>{
                           ReactDOM.render(
                            <NoteDueSoonList notes={data.notes}/>, document.querySelector("#notes")
                           );
                        });
                        break;
                    case "diffLowHigh":
                        sendAjax('GET', '/getNotes', null, (data) =>{
                           ReactDOM.render(
                            <NoteDiffLowHighList notes={data.notes}/>, document.querySelector("#notes")
                           );
                        });
                        
                        break;
                    case "diffHighLow":
                        sendAjax('GET', '/getNotes', null, (data) =>{
                           ReactDOM.render(
                           <NoteDiffHighLowList notes={data.notes}/>, document.querySelector("#notes")
                           );
                        });
                        break;
                }
    }
    }, false);
    
                
   document.addEventListener('change', function (event) {
        if ( event.target.classList.contains( 'task' ) ) {
              
                switch(event.target.value){
                    case "allTasks":
                        sendAjax('GET', '/getNotes', null, (data) =>{
                           ReactDOM.render(
                            <NoteList notes={data.notes}/>, document.querySelector("#notes")
                           );
                        });
                        break;
                    case "completedTasks":
                        sendAjax('GET', '/getNotes', null, (data) =>{
                           ReactDOM.render(
                            <NoteCompletedList notes={data.notes}/>, document.querySelector("#notes")
                           );
                        });
                        
                        break;
                    case "incompleteTasks":
                        sendAjax('GET', '/getNotes', null, (data) =>{
                           ReactDOM.render(
                            <NoteIncompleteList notes={data.notes}/>, document.querySelector("#notes")
                           );
                        });
                        break;
                }
                console.log(event.target.value);
        }
        }, false);

        loadNotesFromServer();
};
const getToken = () =>{
    sendAjax('GET', '/getToken', null, (result) =>{
        setup(result.csrfToken);
    });
};

$(document).ready(function(){
    getToken();
});






const handleEditNote = (e) => {
    e.preventDefault();
    
    $("#noteMessage").animate({height: 'hide'},350);
    
    sendAjax('POST', $("#noteEditForm").attr("action"), $("#noteEditForm").serialize(), function(){
        loadEditNotesFromServer();
    });
    return false;
};


const NoteEditForm = (props) =>{
    //console.dir(props);
    return(
        <form id="noteEditForm"
            onSubmit={handleEditNote}
            name="noteEditForm"
            action="/deleteNotes"
            method="POST"
            className="noteEditForm"
        >
        
        <input type="hidden" name="_csrf" value={props.csrf}/>
        </form>
        
    );
};

let currentId;

//variables
let title;
let desc;
let dueDate;
let dueTime;
let Level;
let finished = '';


const NoteDeleteForm = (props) =>{
    console.dir("Note Delete Form");
    return(
        <form id="noteDeleteForm"
            
            name="noteDeleteForm"
            action="/deleteNotes"
            method="POST"
            className="noteDeleteForm"
        >
        <input type="hidden" name="_id" value={currentId}/>
        <input type="hidden" name="_csrf" value={props.csrf}/>
        </form>
        
    );
    
};


const NoteUpdateForm = (props) =>{
    console.dir("Note Update Form");
    return(
        <form id="noteUpdateForm"
            
            name="noteUpdateForm"
            action="/updateNotes"
            method="POST"
            className="noteUpdateForm"
        >
        <input type="hidden" name="title" value={title}/>
        <input type="hidden" name="desc" value={desc}/>
        <input type="hidden" name="dueDate" value={dueDate}/>
        <input type="hidden" name="dueTime" value={dueTime}/>
        <input type="hidden" name="Level" value={Level}/>
        <input type="hidden" name="noteFinished" value={finished}/>
        
        <input type="hidden" name="_id" value={currentId}/>
        <input type="hidden" name="_csrf" value={props.csrf}/>
        </form>
        
    );
    
};


const handleDeleteNote = (e) => {
    //e.preventDefault();
    
    $("#noteMessage").animate({width: 'hide'},350);
    console.log("handle");
    sendAjax('POST', $("#noteDeleteForm").attr("action"), $("#noteDeleteForm").serialize(), function(){
        
        
    });
    sendAjax('GET', '/getNotes', null, (data) =>{
       ReactDOM.render(
        <NoteEditList notes={data.notes}/>, document.querySelector("#notes")
       );
    });
    return false;
};

const handleUpdateNote = (e) => {
    //e.preventDefault();
    
    
    $("#noteMessage").animate({width: 'hide'},350);
    console.log("handle");
    sendAjax('POST', $("#noteUpdateForm").attr("action"), $("#noteUpdateForm").serialize(), function(){
        
        
    });
    getToken();
    return false;
};

//displays all notes a user owns and adds inputs, delete and update buttons
const NoteEditList = function(props){
    if(props.notes.length === 0){
        return(
            
            
            <div>
        <h1 id="editMessage">Select Note to Edit or Delete</h1>
        <h3 className="emptyNote">No Notes to Edit</h3> 
        <h1 className="backMessage">BACK</h1>
        </div>
        );
    }
    const noteNodes = props.notes.map(function(note){
        var d = new Date(note.dueDate);
        
        
        return(
            <div key={note._id} id={note._id} className="note">
            <label htmlFor="title">Title: </label>
            <input className="noteTitle" type="text" name="title" placeholder={note.title}/>
            <label htmlFor="desc">Description: </label>
            <textarea className="noteDesc" type="text" name="desc" placeholder={note.desc}/>
            <label htmlFor="diffLevel">Difficulty Level: </label>
            <input className="noteDiffLevel" type="number"  min="0" max="5" name="diffLevel" placeholder={note.diffLevel}/>
            <label htmlFor="dueDate">Due date: </label>
            <input className="noteDueDate" type="date" name="dueDate" placeholder={d.toDateString()}/>
            <label htmlFor="dueTime">Time due: </label>
            <input className="noteDueTime" type="time" name="dueTime" placeholder={note.dueTime}/>
            <input type="hidden" name="_csrf" value={props.csrf}/>
            <h3 className="noteDelete" id="noteDelete">Delete</h3>
            <h3 className="noteUpdate" id="noteUpdate">Update</h3>
            </div>
        
    );
        return(
            <div key={note._id} id={note._id} className="note">
                <h3 className="noteTitle">Title: </h3>
            
                <h3 className="noteDesc">Description: {note.desc}</h3>
                <h3 className="noteDiffLevel">Difficulty: {note.diffLevel}</h3>
                <h3 className="noteDueDate">Due Date: {d.toDateString()}</h3>
                <h3 className="noteDueTime">Due Time: {note.dueTime}</h3>
		
            </div> 
        );
    });
    
    return(
        <div>
        <h1 id="editMessage">Select Note to Edit or Delete</h1>
        <div className="noteEditList">
        
            {noteNodes}
        </div>
        <h1 className="backMessage">BACK</h1>
        </div>
    );
};
//loads the edit screen
const loadEditNotesFromServer = () =>{
    sendAjax('GET', '/getNotes', null, (data) =>{
       ReactDOM.render(
        <NoteEditList notes={data.notes}/>, document.querySelector("#notes")
       );
    });
};

//sets up edit screen with CSRF tokens and event listeners
const setupEdit = function(csrf) {
    //console.log("test");
    ReactDOM.render(
        <NoteEditList notes={[]}/>, document.querySelector("#notes")
    );
     ReactDOM.render(
        <NoteEditForm csrf={csrf}/>, document.querySelector("#makeNote")
    );
    
    //Event bubbling to make edit links trigger Note Edit mode
    //For now it just deletes the note
    document.addEventListener('click', function (event) {
    if ( event.target.classList.contains( 'noteDelete' ) ) {
        currentId = event.target.parentElement.id;
        ReactDOM.render(
        <NoteDeleteForm csrf={csrf}/>, document.querySelector("#makeNote")
    );
    handleDeleteNote();    
    }
    }, false);
    
    
    document.addEventListener('click', function (event) {
    if ( event.target.classList.contains( 'backMessage' ) ) {
        getToken();
        
    }
    }, false);
                                                       
    
    //emptyNote
    document.addEventListener('click', function (event) {
    if ( event.target.classList.contains( 'noteUpdate' ) ) {
        console.log(event.target.parentElement.querySelector(".noteTitle").value);
        currentId = event.target.parentElement.id;
        title = event.target.parentElement.querySelector(".noteTitle").value;
        desc = event.target.parentElement.querySelector(".noteDesc").value;
        dueDate = event.target.parentElement.querySelector(".noteDueDate").value;
        dueTime = event.target.parentElement.querySelector(".noteDueTime").value;
        Level = event.target.parentElement.querySelector(".noteDiffLevel").value;
        
        
        ReactDOM.render(
        <NoteUpdateForm csrf={csrf}/>, document.querySelector("#makeNote")
       );
       handleUpdateNote();
    }
    }, false);
    
    
    loadEditNotesFromServer();
};

//added to test CSRF on new page
//send and setup edit page
const getEditToken = () =>{
    console.log("csrf token");
    sendAjax('GET', '/getToken', null, (result) =>{
        setupEdit(result.csrfToken);
    });
};


const handleFinishedNote = (e) => {
     $("#noteMessage").animate({width: 'hide'},350);
    console.log("handle");
    sendAjax('POST', $("#noteFinishedForm").attr("action"), $("#noteFinishedForm").serialize(), function(){
        
        
    });
    return false;
};

const NoteFinishedForm = (props) =>{
    console.dir("Note Finished Form");
    return(
        <form id="noteFinishedForm"
            
            name="noteFinishedForm"
            action="/finishedNotes"
            method="POST"
            className="noteFinishedForm"
        >
        <input type="hidden" name="_id" value={currentId}/>
        <input type="hidden" name="_csrf" value={props.csrf}/>
        </form>
        
    );
};


//form to show all completed tasks
const NoteCompletedList = function(props){
    if(props.notes.length === 0){
        return(
            
            
            <div>
        <h1 id="editMessage">Select Note to Edit or Delete</h1>
        <h3 className="emptyNote">No Notes to Edit</h3> 
        <h1 className="backMessage">BACK</h1>
        </div>
        );
    }
    const noteNodes = props.notes.map(function(note){
        
        var d = new Date(note.dueDate);
        if(note.noteFinished){
           return(
            <div key={note._id} id={note._id} className="note">
                <h3 className="noteEdit">Edit</h3>
                <h3 className="noteTitle">Title: {note.title}</h3>
            
                <h3 className="noteDesc">Description: {note.desc}</h3>
                <h3 className="noteDiffLevel">Difficulty: {note.diffLevel}</h3>
                <h3 className="noteDueDate">Due Date: {d.toDateString()}</h3>
                <h3 className="noteDueTime">Due Time: {note.dueTime}</h3>
                <h3 className="noteFinished">Finished?:</h3>
                <input className="noteFinished" type="checkbox" name="finished" checked/>
            </div> 
            ); 
        
        }else{
            return;
        }
    });
    const noteNodes1 = props.notes.map(function(note){
        
        var d = new Date(note.dueDate);
        if(!note.noteFinished){
           return(
            <div key={note._id} id={note._id} className="note">
                <h3 className="noteEdit">Edit</h3>
                <h3 className="noteTitle">Title: {note.title}</h3>
            
                <h3 className="noteDesc">Description: {note.desc}</h3>
                <h3 className="noteDiffLevel">Difficulty: {note.diffLevel}</h3>
                <h3 className="noteDueDate">Due Date: {d.toDateString()}</h3>
                <h3 className="noteDueTime">Due Time: {note.dueTime}</h3>
                <h3 className="noteFinished">Finished?:</h3>
                <input className="noteFinished" type="checkbox" name="finished" />
            </div> 
            ); 
        
        }else{
            return;
        }
    });
    
    return(
        <div className="noteEditList">
        <h1>Completed Tasks</h1>
        {noteNodes}
        <h1>Incomplete Tasks</h1>
        {noteNodes1}
        </div>
    );
};

const NoteIncompleteList = function(props){
    if(props.notes.length === 0){
        return(
            
            
            <div>
        <h1 id="editMessage">Select Note to Edit or Delete</h1>
        <h3 className="emptyNote">No Notes to Edit</h3> 
        <h1 className="backMessage">BACK</h1>
        </div>
        );
    }
    const noteNodes1 = props.notes.map(function(note){
        
        var d = new Date(note.dueDate);
        if(note.noteFinished){
           return(
            <div key={note._id} id={note._id} className="note">
                <h3 className="noteEdit">Edit</h3>
                <h3 className="noteTitle">Title: {note.title}</h3>
            
                <h3 className="noteDesc">Description: {note.desc}</h3>
                <h3 className="noteDiffLevel">Difficulty: {note.diffLevel}</h3>
                <h3 className="noteDueDate">Due Date: {d.toDateString()}</h3>
                <h3 className="noteDueTime">Due Time: {note.dueTime}</h3>
        <       h3 className="noteFinished">Finished?:</h3>
                <input className="noteFinished" type="checkbox" name="finished" checked/>
            </div> 
            ); 
        
        }else{
            return;
        }
    });
    const noteNodes = props.notes.map(function(note){
        
        var d = new Date(note.dueDate);
        if(!note.noteFinished){
           return(
            <div key={note._id} id={note._id} className="note">
                <h3 className="noteEdit">Edit</h3>
                <h3 className="noteTitle">Title: {note.title}</h3>
            
                <h3 className="noteDesc">Description: {note.desc}</h3>
                <h3 className="noteDiffLevel">Difficulty: {note.diffLevel}</h3>
                <h3 className="noteDueDate">Due Date: {d.toDateString()}</h3>
                <h3 className="noteDueTime">Due Time: {note.dueTime}</h3>
                <h3 className="noteFinished">Finished?:</h3>
                <input className="noteFinished" type="checkbox" name="finished" />
            </div> 
            ); 
        
        }else{
            return;
        }
    });
    
    return(
        <div className="noteEditList">
        <h1>Incomplete Tasks</h1>
        {noteNodes}
        <h1>Completed Tasks</h1>
        {noteNodes1}
        </div>
    );
};


const NoteDiffLowHighList = function(props){
    if(props.notes.length === 0){
        return(
            
            
            <div>
        <h1 id="editMessage">Select Note to Edit or Delete</h1>
        <h3 className="emptyNote">No Notes to Edit</h3> 
        <h1 className="backMessage">BACK</h1>
        </div>
        );
    }
    props.notes.sort((a, b) => a.diffLevel - b.diffLevel);
     console.log(props.notes);
    //props.notes.sort(function (a, b) {a.diffLevel > b.diffLevel});
    const noteNodes = props.notes.map(function(note){
        
        var d = new Date(note.dueDate);
           if(note.noteFinished == true){
            return(
            <div key={note._id} id={note._id} className="note">
                <h3 className="noteEdit">Edit</h3>
                <h3 className="noteTitle">Title: {note.title}</h3>
            
                <h3 className="noteDesc">Description: {note.desc}</h3>
                <h3 className="noteDiffLevel">Difficulty: {note.diffLevel}</h3>
                <h3 className="noteDueDate">Due Date: {d.toDateString()}</h3>
                <h3 className="noteDueTime">Due Time: {note.dueTime}</h3>
                <h3 className="noteFinished">Finished?:</h3>
                <input className="noteFinished" type="checkbox" name="finished" checked/>
            </div> 
            ); 
           
           }
        if(note.noteFinished == false){
        return(
            <div key={note._id} id={note._id} className="note">
                <h3 className="noteEdit">Edit</h3>
                <h3 className="noteTitle">Title: {note.title}</h3>
            
                <h3 className="noteDesc">Description: {note.desc}</h3>
                <h3 className="noteDiffLevel">Difficulty: {note.diffLevel}</h3>
                <h3 className="noteDueDate">Due Date: {d.toDateString()}</h3>
                <h3 className="noteDueTime">Due Time: {note.dueTime}</h3>
                <h3 className="noteFinished">Finished?:</h3>
                <input className="noteFinished" type="checkbox" name="finished"/>
            </div> 
            ); 
           
           }
    });
    
    return(
        <div className="noteEditList">
        <h1>Least to Most Difficult</h1>
        {noteNodes}
        </div>
    );
};



const NoteDiffHighLowList = function(props){
    if(props.notes.length === 0){
        return(
            
            
            <div>
        <h1 id="editMessage">Select Note to Edit or Delete</h1>
        <h3 className="emptyNote">No Notes to Edit</h3> 
        <h1 className="backMessage">BACK</h1>
        </div>
        );
    }
    props.notes.sort((a, b) => b.diffLevel - a.diffLevel);
     console.log(props.notes);
    //props.notes.sort(function (a, b) {a.diffLevel > b.diffLevel});
    const noteNodes = props.notes.map(function(note){
        
        var d = new Date(note.dueDate);
        if(note.noteFinished == true){
            return(
            <div key={note._id} id={note._id} className="note">
                <h3 className="noteEdit">Edit</h3>
                <h3 className="noteTitle">Title: {note.title}</h3>
            
                <h3 className="noteDesc">Description: {note.desc}</h3>
                <h3 className="noteDiffLevel">Difficulty: {note.diffLevel}</h3>
                <h3 className="noteDueDate">Due Date: {d.toDateString()}</h3>
                <h3 className="noteDueTime">Due Time: {note.dueTime}</h3>
                <h3 className="noteFinished">Finished?:</h3>
                <input className="noteFinished" type="checkbox" name="finished" checked/>
            </div> 
            ); 
           
           }
        if(note.noteFinished == false){
        return(
            <div key={note._id} id={note._id} className="note">
                <h3 className="noteEdit">Edit</h3>
                <h3 className="noteTitle">Title: {note.title}</h3>
            
                <h3 className="noteDesc">Description: {note.desc}</h3>
                <h3 className="noteDiffLevel">Difficulty: {note.diffLevel}</h3>
                <h3 className="noteDueDate">Due Date: {d.toDateString()}</h3>
                <h3 className="noteDueTime">Due Time: {note.dueTime}</h3>
                <h3 className="noteFinished">Finished?:</h3>
                <input className="noteFinished" type="checkbox" name="finished"/>
            </div> 
            ); 
           
           }
           
    });
    
    return(
        <div className="noteEditList">
        <h1>Most to Least Difficult</h1>
        {noteNodes}
        </div>
    );
};

//sorts List by tasks due soonest.
const NoteDueSoonList = function(props){
    if(props.notes.length === 0){
        return(
            
            
            <div>
        <h1 id="editMessage">Select Note to Edit or Delete</h1>
        <h3 className="emptyNote">No Notes to Edit</h3> 
        <h1 className="backMessage">BACK</h1>
        </div>
        );
    }
    //Adding the hour to the stored date
    /*
    Some Code borrowed from https://stackoverflow.com/questions/37466777/converting-time-string-into-date-object
    it's used to parse the hour and place it into the date
    */
    for(let i =0; i<props.notes.length; i++){
        props.notes[i].dueDate = new Date(props.notes[i].dueDate);
        props.notes[i].dueDate.setHours(props.notes[i].dueTime.substr(0,props.notes[i].dueTime.indexOf(":")));
        props.notes[i].dueDate.setMinutes(props.notes[i].dueTime.substr(props.notes[i].dueTime.indexOf(":")+1));
        
    }
    props.notes.sort((a, b) => +new Date(a.dueDate) - +new Date(b.dueDate));
    //props.notes.sort(function (a, b) {a.diffLevel > b.diffLevel});
    const noteNodes = props.notes.map(function(note){
        
        var d = new Date(note.dueDate);
        if(note.noteFinished == true){
            return(
            <div key={note._id} id={note._id} className="note">
                <h3 className="noteEdit">Edit</h3>
                <h3 className="noteTitle">Title: {note.title}</h3>
            
                <h3 className="noteDesc">Description: {note.desc}</h3>
                <h3 className="noteDiffLevel">Difficulty: {note.diffLevel}</h3>
                <h3 className="noteDueDate">Due Date: {d.toDateString()}</h3>
                <h3 className="noteDueTime">Due Time: {note.dueTime}</h3>
                <h3 className="noteFinished">Finished?:</h3>
                <input className="noteFinished" type="checkbox" name="finished" checked/>
            </div> 
            ); 
        }
        if(note.noteFinished == false){
            return(
            <div key={note._id} id={note._id} className="note">
                <h3 className="noteEdit">Edit</h3>
                <h3 className="noteTitle">Title: {note.title}</h3>
            
                <h3 className="noteDesc">Description: {note.desc}</h3>
                <h3 className="noteDiffLevel">Difficulty: {note.diffLevel}</h3>
                <h3 className="noteDueDate">Due Date: {d.toDateString()}</h3>
                <h3 className="noteDueTime">Due Time: {note.dueTime}</h3>
                <h3 className="noteFinished">Finished?:</h3>
                <input className="noteFinished" type="checkbox" name="finished" />
            </div> 
            ); 
        }
           
    });
    
    return(
        <div className="noteEditList">
        <h1>Due Soonest</h1>
        {noteNodes}
        </div>
    );
};

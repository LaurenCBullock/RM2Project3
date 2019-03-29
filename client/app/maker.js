const handleDomo = (e) => {
    e.preventDefault();
    
    $("#domoMessage").animate({width: 'hide'},350);
    if($("#domoName").val() == '' || $("domoAge").val() == '' || $("domoLevel").val() == ''){
        handleError("RAWR! All fields are required");
        return false;
    }
    
    sendAjax('POST', $("#domoForm").attr("action"), $("#domoForm").serialize(), function(){
        loadDomosFromServer();
    });
    return false;
};

const DomoForm = (props) =>{
    return(
        <form id="domoForm"
            onSubmit={handleDomo}
            name="domoForm"
            action="/maker"
            method="POST"
            className="domoForm"
        >
        <label htmlFor="name">Name: </label>
        <input id="domoName" type="text" name="name" placeholder="Domo Name"/>
        <label htmlFor="age">Age: </label>
        <input id="domoAge" type="text" name="age" placeholder="Domo Age"/>
        <label htmlFor="level">Level: </label>
        <input id="domoLevel" type="text" name="level" placeholder="Domo Level"/>
        <input type="hidden" name="_csrf" value={props.csrf}/>
        <input className="makeDomoSubmit" type="submit" value="Make Domo"/>
        </form>
        
    );
};

const DomoList = function(props){
    if(props.domos.length === 0){
        return(
        <div className="domoList">
            <h3 className="emptyDomo">No Domos yet</h3>    
        </div>
        );
    }
    const domoNodes = props.domos.map(function(domo){
        return(
            <div key={domo._id} id={domo._id} className="domo">
                <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace"/>
                <h3 className="domoName">Name: {domo.name}</h3>
                <h3 className="domoAge">Age: {domo.age}</h3>
                <h3 className="domoLevel">Level: {domo.level}</h3>
                <h3 className="domoEdit"> Delete</h3>
            </div> 
        );
    });
    
    return(
        <div className="domoList">
            {domoNodes}
        </div>
    );
};




const loadDomosFromServer = () =>{
    sendAjax('GET', '/getDomos', null, (data) =>{
       ReactDOM.render(
        <DomoList domos={data.domos}/>, document.querySelector("#domos")
       );
    });
};

const editDomo = (data,csrfT) =>{
    /*console.log(data);
    
    sendAjax('DELETE', '/editDomo', null, (data) =>{
        console.log(data.domoId);*/
    $.ajax({
    cache: false,
    type: "DELETE",
    url: "/editDomo",
    data: data,
    dataType: "json",
    success: (result, status, xhr) => {
      $("#domoMessage").animate({width:'hide'},350);

      window.location = result.redirect;
    },
    error: (xhr, status, error) => {
      const messageObj = JSON.parse(xhr.responseText);

      handleError(messageObj.error);
    }
  });     
    
    
    /*$.ajax({
			type: 'Delete',
			url: '/editDomo',
			data: data.domoId
			headers: {
					"Accept": "application/json; odata=verbose"}
		})
        
      console.log(data.domoId);  
        
    });*/
};

const setup = function(csrf) {
    ReactDOM.render(
        <DomoForm csrf={csrf}/>, document.querySelector("#makeDomo")
    );
    ReactDOM.render(
        <DomoList domos={[]}/>, document.querySelector("#domos")
    );
    
    //Event bubbling to make edit links trigger Domo Edit mode
    //For now it just deletes the domo
    document.addEventListener('click', function (event) {
    if ( event.target.classList.contains( 'domoEdit' ) ) {
        event.preventDefault();
        //if we get parent element then we know db key
        let domoId = event.target.parentElement.id;
        editDomo(domoId,csrf);
        
    }
}, false);
    
    
    loadDomosFromServer();
};

const getToken = () =>{
    sendAjax('GET', '/getToken', null, (result) =>{
        setup(result.csrfToken);
    });
};

$(document).ready(function(){
    getToken();
});













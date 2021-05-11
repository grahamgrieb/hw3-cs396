const baseURL = 'https://cs396-hw3-gmg.herokuapp.com';

const initResetButton = () => {
    // if you want to reset your DB data, click this button:
    document.querySelector('#reset').onclick = ev => {
        fetch(`${baseURL}/reset/`)
            .then(response => response.json())
            .then(data => {
                console.log('reset:', data);
            });
    };
};



// invoke this function when the page loads:
initResetButton();
function doctorClick(id){
    fetch(`/doctors/${id}`)
        .then(response => {
            if (!response.ok) { 
                // send to catch block:
                throw Error(response.statusText);
            } else {
                response.json()
                .then(data=>{
                    document.getElementById("doctor").innerHTML=`<h1>${data.name}</h1><button onclick="edit('${data._id}')" class="btn">edit</button><button onclick="deleteDoc('${data._id}')" class="btn">delete</button><p>Seasons: ${data.seasons}</p><img src='${data.image_url}'>`;
                });
            }
        })
        .then(data => {
            console.log('Success:', data);
        })
        .catch(err => {
            console.error('Error:', err);
        }); 

        fetch(`/doctors/${id}/companions`)
        .then(response => {
            if (!response.ok) { 
                // send to catch block:
                throw Error(response.statusText);
            } else {
                response.json()
                .then(data=>{
                    document.getElementById("companions").innerHTML=`<h1>Companions</h1><div id="companions_div" class="companions"></div>`
                    document.getElementById("companions_div").innerHTML=``;
                    data.forEach(element=>{
                        document.getElementById("companions_div").innerHTML+=`<section><div><img src='${element.image_url}'><p>${element.name}</p> <button onclick="editComp('${element._id}','${id}')" class="btn1">edit</button><button onclick="deleteComp('${element._id}','${id}')" class="btn1">delete</button></div></section>`;
                    })
                    document.getElementById("companions_div").innerHTML+=`<button class="btn" onclick="addCompanion('${id}')">Add New Companion</button>`
                });
            }
        })
        .then(data => {
            console.log('Success:', data);
        })
        .catch(err => {
            //console.error('Error:', err);
        });   

}
function edit(id){
    fetch(`/doctors/${id}`)
        .then(response => {
            if (!response.ok) { 
                // send to catch block:
                throw Error(response.statusText);
            } else {
                response.json()
                .then(data=>{
                    addDoctor();
                    document.getElementById("save_button").onclick= function() { patch(data._id);};
                    document.getElementById("cancel_button").onclick= function() { doctorClick(data._id);};
                    document.getElementById("name_box").value=data.name;
                    document.getElementById("seasons_box").value=data.seasons;
                    document.getElementById("ordering_box").value=data.ordering;
                    document.getElementById("img_box").value=data.image_url;
                   
                });
            }
        })
        .then(data => {
            console.log('Success:', data);
        })
        .catch(err => {
            console.error('Error:', err);
        }); 
        
}

function editComp(id,docid){
    fetch(`/companions/${id}`)
        .then(response => {
            if (!response.ok) { 
                // send to catch block:
                throw Error(response.statusText);
            } else {
                response.json()
                .then(data=>{
                    addCompanion();
                    document.getElementById("save_button1").onclick= function() { patchComp(id,docid);};
                    document.getElementById("cancel_button1").onclick= function() { doctorClick(docid);};
                    document.getElementById("name_box1").value=data.name;
                    document.getElementById("seasons_box1").value=data.seasons;
                    document.getElementById("character_box1").value=data.character;
                    document.getElementById("alive_box1").checked=data.alive;
                    document.getElementById("doctors_box1").value=data.doctors;
                    document.getElementById("ordering_box1").value=data.ordering;
                    document.getElementById("img_box1").value=data.image_url;
                   
                });
            }
        })
        .then(data => {
            console.log('Success:', data);
        })
        .catch(err => {
            console.error('Error:', err);
        }); 
        
}

function patch(id){
    const newDoc = {
        'name' : document.getElementById("name_box").value,
        'seasons' : document.getElementById("seasons_box").value.split`,`.map(x=>+x),
        //JSON.parse(`'ordering' : document.getElementById("ordering_box").value`),
        'ordering' : document.getElementById("ordering_box").value,
        'image_url' : document.getElementById("img_box").value
    };
    if((!newDoc.name||!newDoc.seasons||!newDoc.ordering)){
        document.getElementById("error").innerHTML=`Fix Data`;
        return;
    }
    fetch(`/doctors/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newDoc)})
    .then(response => {
        if (!response.ok) { 
            document.getElementById("error").innerHTML=`Fix Data`;
        } else {
            response.json()
            .then(data=>{
                sidebar();
                console.log(data);
                doctorClick(data._id);
            });
        }
    })
    .then(data => {
        console.log('Success:', data);
    })
    .catch(err => {
        console.error('AAAAError:', err);
    }); 
}
function patchComp(id,docid){
    const newComp = {
        'name' : document.getElementById("name_box1").value,
        'character' : document.getElementById("character_box1").value,
        'alive' : document.getElementById("alive_box1").checked,
        'seasons' : document.getElementById("seasons_box1").value.split`,`.map(x=>+x),
        'doctors' : document.getElementById("doctors_box1").value.split`,`.map(String),
        'ordering' : document.getElementById("ordering_box1").value,
        'image_url' : document.getElementById("img_box1").value
    };
    if((!newComp.name||!newComp.character||!newComp.seasons||!newComp.doctors||!newComp.ordering)){
        document.getElementById("error_comp").innerHTML=`Fix Data`;
        return;
    }
    fetch(`/companions/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newComp)})
    .then(response => {
        if (!response.ok) { 
            document.getElementById("error_comp").innerHTML=`Fix Data`;
        } else {
            response.json()
            .then(data=>{
                doctorClick(docid);
            });
        }
    })
    .then(data => {
        console.log('Success:', data);
    })
    .catch(err => {
        console.error('AAAAError:', err);
    }); 
}
function addDoctor(){
    cancel();
    document.getElementById("doctor").innerHTML=`<h4>Name</h4><input type="text" id="name_box"><br>
    <h4>Seasons</h4><input type="text" id="seasons_box"><br>
    <h4>Ordering</h4><input type="text" id="ordering_box"><br>
    <h4>Image</h4><input type="text" id="img_box"><br><br>
    <button  id="save_button" onClick="save()" class="btn-main btn">Save</button><button id="cancel_button" onclick="cancel()" class="btn">Cancel</button><br><p id="error"></p>`;
   
}
function addCompanion(docid){
    document.getElementById("companions").innerHTML=`
    <h4>Name</h4><input type="text" id="name_box1"><br>
    <h4>Character</h4><input type="text" id="character_box1"><br>
    <h4>Seasons</h4><input type="text" id="seasons_box1"><br>
    <h4>Ordering</h4><input type="text" id="ordering_box1"><br>
    <h4>Doctors</h4><input type="text" id="doctors_box1"><br>
    <h4>Alive</h4><input type="checkbox" id="alive_box1"><br>
    <h4>Image</h4><input type="text" id="img_box1"><br><br>
    <button  id="save_button1" onClick="saveComp('${docid}')" class="btn-main btn">Save</button><button id="cancel_button1" onclick="doctorClick('${docid}')" class="btn">Cancel</button><br><p id="error_comp"></p>`;
    document.getElementById("doctors_box1").value=docid;
}
function save(){
    const newDoc = {
        'name' : document.getElementById("name_box").value,
        'seasons' : document.getElementById("seasons_box").value.split`,`.map(x=>+x),
        'ordering' : document.getElementById("ordering_box").value,
        'image_url' : document.getElementById("img_box").value
    };
        
        
    fetch(`/doctors`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newDoc)})
    .then(response => {
        if (!response.ok) { 
            document.getElementById("error").innerHTML=`Fix Data`;
        } else {
            response.json()
            .then(data=>{
                sidebar();
                console.log(data);
                doctorClick(data._id);
            });
        }
    })
    .then(data => {
        console.log('Success:', data);
    })
    .catch(err => {
        console.error('Error:', err);
    }); 

}
function saveComp(docid){
    const newComp = {
        'name' : document.getElementById("name_box1").value,
        'character' : document.getElementById("character_box1").value,
        'alive' : document.getElementById("alive_box1").checked,
        'seasons' : document.getElementById("seasons_box1").value.split`,`.map(x=>+x),
        'doctors' : document.getElementById("doctors_box1").value.split`,`.map(String),
        'ordering' : document.getElementById("ordering_box1").value,
        'image_url' : document.getElementById("img_box1").value
    };
        
        
    fetch(`/companions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newComp)})
    .then(response => {
        if (!response.ok) { 
            document.getElementById("error_comp").innerHTML=`Fix Data`;
        } else {
            response.json()
            .then(data=>{
                doctorClick(docid);
            });
        }
    })
    .then(data => {
        console.log('Success:', data);
    })
    .catch(err => {
        console.error('Error:', err);
    }); 

}
function deleteDoc(id){
    if (window.confirm("Do you really want to delete the doctor?")) {
        fetch(`/doctors/${id}`, {
            method: 'DELETE',
            headers: {
            'Content-Type': 'application/json'
            }})
        .then(response => {
            if (!response.ok) { 
                console.log("error delete")
            }
        })
        .then(data => {
            console.log('Success:', data);
        })
        .catch(err => {
            console.error('AAAAError:', err);
        }); 
        sidebar();
        cancel(); 
    }      
}
function deleteComp(id,docid){
    if (window.confirm("Do you really want to delete the companion?")) {
        fetch(`/companions/${id}`, {
            method: 'DELETE',
            headers: {
            'Content-Type': 'application/json'
            }})
        .then(response => {
            if (!response.ok) { 
                console.log("error delete")
            }
        })
        .then(data => {
            console.log('Success:', data);
        })
        .catch(err => {
            console.error('AAAAError:', err);
        }); 
        doctorClick(docid);
        //sidebar();
        //cancel(); 
    }      
}
function cancel(){
    document.getElementById("doctor").innerHTML=``;
    document.getElementById("companions").innerHTML=``;
}
function sidebar(){
    fetch('/doctors')
        .then(response => {
            if (!response.ok) { 
                // send to catch block:
                throw Error(response.statusText);
            } else {
                response.json()
                .then(data=>{
                    document.getElementById("aside_docs").innerHTML=``;
                    data.forEach(element => {
                        document.getElementById("aside_docs").innerHTML+=`<button class="list_button" onclick="doctorClick('${element._id}')">${element.name}</button>`;
                    })
                    document.getElementById("aside_docs").innerHTML+=`<button class="btn" onclick="addDoctor()">Add New Doctor</button>`;
                });
            }
        })
        .then(data => {
            console.log('Success:', data);
        })
        .catch(err => {
            console.error('Error:', err);
        });
}
sidebar();

function init() {
    populateTab("tab1");
}


function changeTab(tabnav){
    
    var val = tabnav.id;
    if (document.getElementById(val).className != "is-active") {
    
        document.getElementById(val).className="is-active"; 
        val = val.slice(0,val.length-3);
        var elem = document.getElementById(val);
        var old = document.getElementsByClassName("displayedTab");
        for (var i = 0; i < old.length; i++) {
            document.getElementById(old[i].id+"nav").className="is-not-active";
            old[i].className="notdisplayedTab";
        } 
        elem.className="displayedTab"; 
        populateTab(val); 
    }
}

function populateTab(tab) {
    fetch(tab+'component.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById(tab).innerHTML=data;
			initMap();
			initMapJS();
        });
    
        
}

function showPanel(checkbox) {
	let panel;
	if (checkbox.id == "address-box") {
		panel = document.getElementById("address-panel");
		if (checkbox.checked) {
			panel.classList.remove("hide-result");

		} else {
			panel.classList.add("hide-result");
		}

	} else if (checkbox.id == "maps-box") {
		panel = document.getElementById("maps-panel");
		if (checkbox.checked) {
			panel.classList.remove("hide-result");

		} else {
			panel.classList.add("hide-result");
		}

	} else if (checkbox.id == "data-box") {
		panel = document.getElementById("data-panel");
		if (checkbox.checked) {
			panel.classList.remove("hide-result");

		} else {
			panel.classList.add("hide-result");
		}

	} else if (checkbox.id == "support-box") {
		panel = document.getElementById("support-panel");
		if (checkbox.checked) {
			panel.classList.remove("hide-result");

		} else {
			panel.classList.add("hide-result");
		}

    }
}

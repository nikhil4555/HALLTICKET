

//document.getElementById('hallTicketForm').onsubmit = function(event) {
      //      event.preventDefault();
            // Perform validation or form submission here
        //    alert('Form submitted!');
        //}; 
        
        function clearForm() { 
            document.getElementById('hallTicketForm').reset();
        }

        // Attach the clearForm function to the click event of the cancel button
        document.querySelector('.button-container button[type="button"]').onclick = clearForm;

        
// Initialize options for preferences
const allOptions = ["Hyderabad", "Secundrabad", "Uppal", "Gachibowli", "Warangal"];
let selectedOptions = [];

// Update preferences based on user selections
function updatePreferences() {
    const preference1 = document.getElementById("preference1").value;
    selectedOptions = [preference1];

    // Update options for preference2
    const preference2Select = document.getElementById("preference2");
    preference2Select.innerHTML = "<option value=''>Select...</option>"; // Include "Select..." option
    for (const option of allOptions) {
        if (option !== preference1) {
            preference2Select.innerHTML += `<option value="${option}">${option}</option>`;
        }
    }

    // Reset preference3 when preference1 changes
    const preference3Select = document.getElementById("preference3");
    preference3Select.innerHTML = "<option value=''>Select...</option>"; // Include "Select..." option
}

// Update options for preference3
function updatePreference3() {
    const preference2 = document.getElementById("preference2").value;
    selectedOptions = [document.getElementById("preference1").value, preference2];

    const preference3Select = document.getElementById("preference3");
    preference3Select.innerHTML = "<option value=''>Select...</option>"; // Include "Select..." option
    for (const option of allOptions) {
        if (!selectedOptions.includes(option)) {
            preference3Select.innerHTML += `<option value="${option}">${option}</option>`;
        }
    }
}

//here default p-1 is set then directly as the p-1 is updated we can directly go to the p-2 and change normally and for p-3 based on p-2 its updated the values
// Attach event listeners
document.getElementById("preference1").addEventListener("change", () => {
    updatePreferences();
    updatePreference3();
});

document.getElementById("preference2").addEventListener("change", updatePreference3);


//When it comes back it refreshes and sets all values to empty
function onpageload(){
    document.getElementById('name').value=""   
    document.getElementById('fatherName').value=""
    document.getElementById('mobile').value=""
    document.getElementById('email').value=""
    document.getElementById('preference1').value=""
    document.getElementById('preference2').value=""
    document.getElementById('preference3').value=""
}
document.addEventListener("load", onpageload);

// Add an event listener for the 'pageshow' event on the window
window.addEventListener('pageshow', function(event) {
    // Check if the page is being loaded from the cache (bfcache)
    if (event.persisted) {
      // If true, reload the page to refresh the form
      clearForm();
    //   window.location.reload();
    }
});


const pswdBtn = document.querySelector("#pswdBtn");
pswdBtn.addEventListener("click", function() {
  const pswdInput = document.getElementById("pword");
  const type = pswdInput.getAttribute("type");
  if (type == "password") {
    pswdInput.setAttribute("type", "text");
    pswdBtn.innerHTML = "Hide Password";
  } else {
    pswdInput.setAttribute("type", "password");
    pswdBtn.innerHTML = "Show Password";
  }
});


// let data = await invModel.getClassifications()
//   let list = '<select type="select" id="classification" name="classification_name" required>' 
//   list += '<option value="">Select an option</option>' 
//   data.rows.forEach((row) => {   
//     list += '<option value="'+ row.classification_name + '">' + row.classification_name + '</option>'  
//   })
//   list += "</select>"
//   document.getElementById("dropDown") = list;
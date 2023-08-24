const delForm = document.getElementById('delForm');
const upBtn = document.getElementById('upBtn');
const updateInputs = document.querySelectorAll('.updateInputs');
const fileInput = document.getElementById('fileInput');
const deleteAccount = function(){
                if (confirm('Are You Sure You Want To Delete Your Account?')) {
                } else {
                    delForm.method = "GET";
                    delForm.action = `/blog/settings/`;
                }
            }

updateInputs.forEach((input)=>{
    input.addEventListener('keyup',()=>{
        upBtn.disabled=false;
    })
});

fileInput.addEventListener('change',()=>{
        upBtn.disabled=false;
})


const imgInput = document.getElementById('fileInput');
const userImg = document.getElementById('user-img');
imgInput.onchange = evt => {
  const [file] = imgInput.files
  if (file) {
    userImg.src = URL.createObjectURL(file)
  }
}
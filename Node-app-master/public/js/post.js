const imgInput = document.getElementById('fileInput');
const postImg = document.getElementById('post-img');
imgInput.onchange = evt => {
  const [file] = imgInput.files
  if (file) {
    postImg.src = URL.createObjectURL(file)
  }
}
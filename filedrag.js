// ************************ Drag and drop ***************** //
let dropArea = document.getElementById("drop-area")

  // Prevent default drag behaviors
  ;['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, preventDefaults, false)
    document.body.addEventListener(eventName, preventDefaults, false)
  })

  // Highlight drop area when item is dragged over it
  ;['dragenter', 'dragover'].forEach(eventName => {
    dropArea.addEventListener(eventName, highlight, false)
  })

  ;['dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, unhighlight, false)
  })
// Handle dropped files
dropArea.addEventListener('drop', handleDrop, false)

function preventDefaults(e) {
  e.preventDefault()
  e.stopPropagation()
}

function highlight(e) {
  dropArea.classList.add('highlight')
}

function unhighlight(e) {
  dropArea.classList.remove('active')
}

function handleDrop(e) {
  var dt = e.dataTransfer
  var files = dt.files

  handleFiles(files)
}

let uploadProgress = []
let progressBar = document.getElementById('progress-bar')

function initializeProgress(numFiles) {
  progressBar.value = 0
  uploadProgress = []

  for (let i = numFiles; i > 0; i--) {
    uploadProgress.push(0)
  }
}

function updateProgress(fileNumber, percent) {
  uploadProgress[fileNumber] = percent
  let total = uploadProgress.reduce((tot, curr) => tot + curr, 0) / uploadProgress.length
  console.debug('update', fileNumber, percent, total)
  progressBar.value = total
}

function handleFiles(files) {


  files = [...files]
  document.getElementById('gallery').innerHTML = '';
  console.log(files);
  initializeProgress(files.length)
  files.forEach(uploadFile)
  files.forEach(previewFile)
}

function previewFile(file) {
  let reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onloadend = function () {
    let img = document.createElement('img')
    img.innerHTML="";
    img.src = reader.result
    document.getElementById('gallery').appendChild(img)
  }
}

function uploadFile(file, i) {
  var url = 'https://api.cloudinary.com/v1_1/joezim007/image/upload'
  var xhr = new XMLHttpRequest()
  var formData = new FormData()
  xhr.open('POST', url, true)
  xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')

  // Update progress (can be used to show progress indicator)
  xhr.upload.addEventListener("progress", function (e) {
    updateProgress(i, (e.loaded * 100.0 / e.total) || 100)
  })

  xhr.addEventListener('readystatechange', function (e) {
    if (xhr.readyState == 4 && xhr.status == 200) {
      updateProgress(i, 100) // <- Add this
    }
    else if (xhr.readyState == 4 && xhr.status != 200) {
      // Error. Inform the user
    }
  })

  formData.append('upload_preset', 'ujpu6gyk')
  formData.append('file', file)
  xhr.send(formData)
}



// ad post functions


function submitForm() {
  //get values

  var adTitleEl = document.querySelector('#ad-title').value;
  var yourName = document.querySelector('#your-name').value;
  var yourEmailidEl = document.querySelector('#your-emailid').value;
  var yourMobileEl = document.querySelector('#your-mobile').value;
  var cityEl = document.querySelector('#ad-city').value;
  var optCatEl = document.querySelector('#opt-cat').value;
  var priceEl = document.querySelector('#priceid').value;
  var modelEl = document.querySelector('#modelid').value;
  var adDiscEl = document.querySelector('#ad-disc').value;
  var adtime = currentDateTime();
  saveAds(adTitleEl, yourName, yourEmailidEl, yourMobileEl, cityEl, optCatEl, priceEl, modelEl, adDiscEl, adtime)

  //Show Alert
  document.querySelector(".alert").style.display = "block";

  //Hide alert after 3 seconds
  setTimeout(function () {
    document.querySelector(".alert").style.display = "none";
    // window.location.href = 'index.html';
  }, 3000);



  return false;
}


//Save ads to firebase
const ref = firebase.storage().ref();

function consoleFile(){
  var files = document.getElementById('fileElem').files || document.getElementById('fileElem').dataTransfer.files;
  console.log(files);

}
function saveAds(adTitleEl, yourName, yourEmailidEl, yourMobileEl, cityEl, optCatEl, priceEl, modelEl, adDiscEl, adtime) {
  //  var newAdRef = adRef.push();
  // var url;
  var files = document.getElementById('fileElem').files || document.getElementById('fileElem').dataTransfer.files;
  for (var i = 0, f; f = files[i]; i++) {
    const file = files[i];
    const name = (+new Date()) + '-' + file.name;
    const metadata = {
      contentType: file.type
    };
    const task = ref.child(name).put(files[i], metadata);
    task
      .then(snapshot => snapshot.ref.getDownloadURL())
      .then(url =>
        // console.log(url),
        db.collection('ads').add({
          Title: adTitleEl,
          Name: yourName,
          Email: yourEmailidEl,
          Mobile: yourMobileEl,
          City: cityEl,
          Catogery: optCatEl.replace(/\s/g, "-"),
          Price: priceEl,
          Model: modelEl,
          adDisc: adDiscEl,
          Time: adtime,
          Url: url,
          Uploader: universalUID,
        })

      )
  }

}

function check() {

  console.log(universalUID);
}
// initialization of firebase



var config = {
    apiKey: "AIzaSyCF_l3Lifx9fFmFZhDcG_1nHB1FddqEfiE",
    authDomain: "olx-pwa-20612.firebaseapp.com",
    databaseURL: "https://olx-pwa-20612.firebaseio.com",
    projectId: "olx-pwa-20612",
    storageBucket: "olx-pwa-20612.appspot.com",
    messagingSenderId: "447845144594"
};

firebase.initializeApp(config);


const db = firebase.firestore();
db.settings({ timestampsInSnapshots: true })
const auth = firebase.auth();

const messaging = firebase.messaging();

// firebase.firestore().enablePersistence()
//   .then(function() {
//       // Initialize Cloud Firestore through firebase
//     //   var db = firebase.firestore();
//   })
//   .catch(function(err) {
//       if (err.code == 'failed-precondition') {
//           // Multiple tabs open, persistence can only be enabled
//           // in one tab at a a time.
//           // ...
//       } else if (err.code == 'unimplemented') {
//           // The current browser does not support all of the
//           // features required to enable persistence
//           // ...
//       }
//   });



// authentication 
var universalUID = "anonymus";
var universalname = "anonymus";


window.addEventListener('load', async e => {

    if ('serviceWorker' in navigator) {
        try {
            navigator.serviceWorker.register("sw.js")
                .then(function () { console.log('Service Worker Registered'); });
        } catch (error) {
            console.log("SW failed");

        }
    }
})


auth.onAuthStateChanged(function (user) {
    if (user) {
        var user = auth.currentUser;
        db.collection('users').get()
            .then((snapshot) => {
                snapshot.forEach((doc) => {
                    if (doc.id == user.uid) {
                        userName = doc.data().username;
                        universalUID = doc.id;

                        // ==========================================================================================

                        console.log(universalUID);
                        // ==========================================================================================

                        universalname = doc.data().username;
                        if (document.querySelector('#pgtitle').innerHTML == "Recent Chats") {
                            loadRooms();
                        }


                        if (document.querySelector('#pgtitle').innerHTML == "OLX") {
                            document.querySelector('#username-display').innerHTML = "Welcome " + doc.data().username;
                            tokenstore();
                        }
                        if (document.querySelector('#pgtitle').innerHTML == "Chatroom") {
                            document.querySelector('#username-display').innerHTML = "Welcome " + doc.data().username;
                            chatload();
                        }
                        if (document.querySelector('#pgtitle').innerHTML == "OLX-AD") {
                            var pageRef;
                            var pageName = window.location.href;
                            pageRef = pageName.substr(pageName.indexOf('?') + 1);
                            console.log(pageRef);

                            if (pageRef != "") {
                                updateAd();
                            }
                            else {
                                console.log("else");
                                $('#loader').addClass('hidediv');
                                // allcontent
                                document.getElementById('allcontent').setAttribute("style", "visibility:visible;")
                            }
                        }
                        if (document.querySelector('#pgtitle').innerHTML == "ADS") {
                            var pageRef;
                            var pageName = window.location.href;
                            pageRef = pageName.substr(pageName.indexOf('?') + 1);
                            console.log(pageRef);
                            if (pageRef == "favads") {
                                foradlist();
                                // alert("promise");
                            }
                        }

                        console.log("ay mamu");
                        $('#myModal').modal('hide');
                        //if(document.querySelector('#myModal').visibility=="tru")
                        //console.log(document.getElementById('myModal').visibility);
                        document.querySelector('#modalerror').innerHTML = " ";
                        document.querySelector('#myaccount').style.pointerEvents = 'none';
                        // console.log("bik gai gourment")
                    }

                })
            })
        document.querySelector('#logout-btn').style.display = 'block';
        // document.querySelector('#featurebtn').style.display = 'block';

        // featurebtn
    } else {
        // No user is signed in.
        // chatload();

        // document.querySelector('#featurebtn').style.display = 'none';
        document.querySelector('#logout-btn').style.display = 'none';


        document.querySelector('#modalerror').innerHTML = " ";
        // document.getElementById("chatbtn").onclick = false;


        if (document.querySelector('#pgtitle').innerHTML == "OLX") {
            document.getElementById('myaccount').style.pointerEvents = 'auto';
            document.querySelector('#username-display').innerHTML = "Welcome";
        }


        if (document.querySelector('#pgtitle').innerHTML == "OLX-AD") {
            $('#loader').addClass('hidediv');
            document.getElementById('allcontent').setAttribute("style", "visibility:visible;")

        }

    }

    if (document.querySelector('#pgtitle').innerHTML == "ADS") {

        var pageRef;
        var pageName = window.location.href;
        pageRef = pageName.substr(pageName.indexOf('?') + 1);
        console.log(pageRef);
        if (pageRef != "favads") {

            foradlist();

            // alert("direct");

        }

    }

    if (document.querySelector('#pgtitle').innerHTML == "AD details") {

        loadDataDetail();
    }
});

function setcatogeryvalue(a) {
    document.getElementById("dropdown-catogory-btn").innerHTML = a;
}

// signupformShow
function signupformShow() {
    document.querySelector('#login-div').style.display = "none";
    document.querySelector('#signin-div').style.display = "block";
    document.querySelector('#modal-title').innerHTML = "SIGN UP";

}

// loginformShow
function loginformShow() {
    document.querySelector('#login-div').style.display = "block";
    document.querySelector('#signin-div').style.display = "none";
    document.querySelector('#modal-title').innerHTML = "LOGIN";

}

/// login 
function login() {
    var emailEL = document.querySelector('#email1').value;
    var passEL = document.querySelector('#pass1').value;
    auth.signInWithEmailAndPassword(emailEL, passEL)
        .then(function () {

            document.querySelector('#modalerror').innerHTML = "login sucessfull"
            setTimeout(function () {
                document.querySelector('#modalerror').innerHTML = " ";
                $('#myModal').modal('hide');
            }, 2000);

        })
        .catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;

            document.querySelector('#modalerror').innerHTML = errorMessage;

            setTimeout(function () {
                document.querySelector('#modalerror').innerHTML = " ";
            }, 3000);


            // setTimeout(function () {
            //     var token= permissionpushnoti();
            //  }, 4000);
            //  // raaste@gmail.com

            // ...
        });
    console.log(emailEL, passEL)
}

// logout 

function logout() {
    auth.signOut().then(function () {
        // Sign-out successful.
    }).catch(function (error) {
        // An error happened.
        var errorCode = error.code;
        var errorMessage = error.message;
        window.alert('error:' + errorMessage);
    });
}


/// sign up 

function Signup() {

    var token = 0;
    var nameEl = document.querySelector('#nametext').value;
    var emailEL = document.querySelector('#email').value;
    var passEL = document.querySelector('#pass').value;
    auth.createUserWithEmailAndPassword(emailEL, passEL)
        .then(data => {
            let uid = data.user.uid;
            localStorage.setItem('userUid', uid);
            console.log("User Created with id " + uid);

            db.collection("users")
                .doc(uid)
                .set({ useremail: emailEL, username: nameEl, token: token })
            // .then(() => {
            //   window.location.assign("../index.html");
            // });
            // console.log(userObject);
        })

        // .catch(function (error) {
        //   // Handle Errors here.

        //   var errorCode = error.code;
        //   var errorMessage = error.message;
        //   console.log("error" + errorMessage);
        //   alert(errorMessage);

        //   // ...
        // });
        .catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;

            document.querySelector('#modalerror').innerHTML = errorMessage;

            setTimeout(function () {
                document.querySelector('#modalerror').innerHTML = " ";
            }, 3000);

            // setTimeout(function () {
            //    var token= permissionpushnoti();
            // }, 4000);
            // // raaste@gmail.com
        });

}

// $(window).scroll(function() {
//     if ($(document).scrollTop() > end) {
//       $('body').addClass('shrink');
//     } else {
//       $('body').removeClass('shrink');
//     }
//   });

// $(document).ready(function(){

//     var showHeaderAt = 150;

//     var win = $(window),
//             body = $('body');

//     // Show the fixed header only on larger screen devices

//     if(win.width() > 400){

//         // When we scroll more than 150px down, we set the
//         // "fixed" class on the body element.

//         win.on('scroll', function(e){

//             if(win.scrollTop() > showHeaderAt) {
//                 body.addClass('fixed');
//             }
//             else {
//                 body.removeClass('fixed');
//             }
//         });

//     }

// });


// ad post special javascript

// $(document).ready(function () {
//     $('#contact_form').bootstrapValidator({
//         // To use feedback icons, ensure that you use Bootstrap v3.1.0 or later
//         feedbackIcons: {
//             valid: 'glyphicon glyphicon-ok',
//             invalid: 'glyphicon glyphicon-remove',
//             validating: 'glyphicon glyphicon-refresh'
//         },
//         fields: {
//             first_name: {
//                 validators: {
//                     stringLength: {
//                         min: 2,
//                     },
//                     notEmpty: {
//                         message: 'Please supply your first name'
//                     }
//                 }
//             },
//             last_name: {
//                 validators: {
//                     stringLength: {
//                         min: 2,
//                     },
//                     notEmpty: {
//                         message: 'Please supply your last name'
//                     }
//                 }
//             },
//             email: {
//                 validators: {
//                     notEmpty: {
//                         message: 'Please supply your email address'
//                     },
//                     emailAddress: {
//                         message: 'Please supply a valid email address'
//                     }
//                 }
//             },
//             phone: {
//                 validators: {
//                     notEmpty: {
//                         message: 'Please supply your phone number'
//                     },
//                     phone: {
//                         country: 'US',
//                         message: 'Please supply a vaild phone number with area code'
//                     }
//                 }
//             },
//             address: {
//                 validators: {
//                     stringLength: {
//                         min: 8,
//                     },
//                     notEmpty: {
//                         message: 'Please supply your street address'
//                     }
//                 }
//             },
//             city: {
//                 validators: {
//                     stringLength: {
//                         min: 4,
//                     },
//                     notEmpty: {
//                         message: 'Please supply your city'
//                     }
//                 }
//             },
//             state: {
//                 validators: {
//                     notEmpty: {
//                         message: 'Please select your state'
//                     }
//                 }
//             },
//             zip: {
//                 validators: {
//                     notEmpty: {
//                         message: 'Please supply your zip code'
//                     },
//                     zipCode: {
//                         country: 'US',
//                         message: 'Please supply a vaild zip code'
//                     }
//                 }
//             },
//             comment: {
//                 validators: {
//                     stringLength: {
//                         min: 10,
//                         max: 200,
//                         message: 'Please enter at least 10 characters and no more than 200'
//                     },
//                     notEmpty: {
//                         message: 'Please supply a description of your project'
//                     }
//                 }
//             }
//         }
//     })
//         .on('success.form.bv', function (e) {
//             $('#success_message').slideDown({ opacity: "show" }, "slow") // Do something ...
//             $('#contact_form').data('bootstrapValidator').resetForm();

//             // Prevent form submission
//             e.preventDefault();

//             // Get the form instance
//             var $form = $(e.target);

//             // Get the BootstrapValidator instance
//             var bv = $form.data('bootstrapValidator');

//             // Use Ajax to submit form data
//             $.post($form.attr('action'), $form.serialize(), function (result) {
//                 console.log(result);
//             }, 'json');
//         });
// });


///////-----------------------------------------------------------------------------------------------------

//ad list javascript

// comment on 7 22 18 

function adlistpage(para) {

    // document.querySelector('#funccheck').innerHTML=para.value;
    // console.log();
    // localStorage.setItem('argument', para);
    para = para.replace(/\s/g, "-");
    window.location.assign(`adlist.html?${para}`);
}



// var alladvertiseObject = [];
var globalallads;
function foradlist() {

    var alladvertise = [];
    // var categoryref = localStorage.getItem('argument');
    var catogeryname = window.location.href;
    // catogeryname=catogeryname.indexOf('?');
    categoryref = catogeryname.substr(catogeryname.indexOf('?') + 1);
    console.log(categoryref);

    // ============================================================================================================


    //         db.collection('ads').where('Catogery', '==', categoryref)
    // .onSnapshot((docs) => {
    //     docs.forEach((doc) => {
    //         var currentAd = new Adlistarray(doc.data().Title, doc.data().Price, doc.data().Price, doc.data().Url, doc.id);
    //         alladvertise.push(currentAd);
    //     })
    //     if (alladvertise.length == 0) {
    //         document.querySelector('#funccheck').innerHTML = "No Ads Found";
    //     }
    //     else {
    //         $('#footeradlist').removeClass('footend');
    //     }
    //     globalallads = alladvertise;
    //     oneTwoRows(globalallads);
    // })
    if (categoryref == "favads") {

        console.log("yay");


        var favAdsarray = [];

        db.collection("users")
            .doc(universalUID)
            .collection("fav")
            .onSnapshot(function (doc) {
                doc.forEach((res) => {
                    var val = res.data();

                    favAdsarray.push(val.favads);
                })


                console.log(favAdsarray.length);

                if (favAdsarray.length == 0) {

                    document.querySelector('#funccheck').innerHTML = "No favourite Ad Found";
                    $('#loader').addClass('hidediv');
                }
                else {


                    // setTimeout(()=>{
                    //     $('#footeradlist').removeClass('footend');

                    // },500)

                    for (var i = 0; i < favAdsarray.length; i++) {

                        db.collection('ads').doc(favAdsarray[i])
                            .onSnapshot((doc) => {
                                var currentAd = new Adlistarray(doc.data().Title, doc.data().Price, doc.data().Price, doc.data().Url, doc.id);
                                alladvertise.push(currentAd);
                                if (alladvertise.length == favAdsarray.length) {
                                    oneTwoRows(alladvertise);
                                }

                            })
                    }

                }

            })










        // globalallads = alladvertise;
        // oneTwoRows(globalallads);


    }
    // ============================================================================================================
    else if (categoryref == "myads") {
        //

        auth.onAuthStateChanged(function (user) {
            var user = auth.currentUser;
            universalUID = user.uid;
            console.log(universalUID);
            //        
            //  $('#footeradlist').removeClass('footend');
            $('#loader').addClass('hidediv');
            db.collection('ads').where('Uploader', '==', universalUID)
                .onSnapshot((docs) => {

                    docs.forEach((doc) => {
                        var currentAd = new Adlistarray(doc.data().Title, doc.data().Price, doc.data().Price, doc.data().Url, doc.id);
                        alladvertise.push(currentAd);
                    })
                    if (alladvertise.length == 0) {
                        document.querySelector('#funccheck').innerHTML = "No Ads Found";
                        console.log("ye kya horaha hai");
                        $('#loader').addClass('hidediv');
                        //yahan
                    }
                    else {
                        $('#footeradlist').removeClass('footend');
                        // $('#loader').addClass('hidediv');

                    }
                    globalallads = alladvertise;
                    oneTwoRows(globalallads);
                })
        })
    }

    // ============================================================================================================


    else if (categoryref != null) {
        console.log(categoryref);

        var fields = categoryref.split(/~/);

        var category = fields[0];
        var city = fields[1];
        var keyword = fields[2];

        // alert(category);
        // alert(city);
        // alert(keyword);

        var resultUpdate = document.getElementById("resultUpdate");


        if ((keyword == "" || keyword == undefined) && (city == undefined || city == "All-Pakistan")) {

            var cat;
            cat = category.replace(/-/g, " ");


            resultUpdate.innerHTML = "Result for " + cat;

            db.collection('ads').where('Catogery', '==', category)
                .onSnapshot({ includeMetadataChanges: true },(docs) => {
                    docs.forEach((doc) => {
                        var currentAd = new Adlistarray(doc.data().Title, doc.data().Price, doc.data().Price, doc.data().Url, doc.id);
                        alladvertise.push(currentAd);
                       
                        var source = docs.metadata.fromCache ? "local cache" : "server";
                        console.log("Data came from " + source);
                    })
                    if (alladvertise.length == 0) {
                        document.querySelector('#funccheck').innerHTML = "No Ads Found";
                        console.log("ye kya horaha hai");
                        $('#loader').addClass('hidediv');
                        //yahan
                    }
                    else {
                        $('#footeradlist').removeClass('footend');
                        // $('#loader').addClass('hidediv');
                        globalallads = alladvertise;
                        console.log("ye kya horaha hai");

                        oneTwoRows(globalallads);
                    }
                    // globalallads = alladvertise;
                    // oneTwoRows(globalallads);
                })
            // // console.log(alladvertiseObject);
            // oneTwoRows(alladvertiseObject);
        }

        else if (keyword == "" && city != "All-Pakistan") {


            var cat, citi;
            cat = category.replace(/-/g, " ");
            citi = city.replace(/-/g, " ");
            resultUpdate.innerHTML = cat + " in " + citi;



            db.collection('ads').where('Catogery', '==', category).where('City', '==', city)
                .onSnapshot((docs) => {
                    docs.forEach((doc) => {
                        var currentAd = new Adlistarray(doc.data().Title, doc.data().Price, doc.data().Price, doc.data().Url, doc.id);
                        alladvertise.push(currentAd);
                    })
                    if (alladvertise.length == 0) {
                        document.querySelector('#funccheck').innerHTML = "No Ads Found";
                        console.log("ye kya horaha hai");
                        $('#loader').addClass('hidediv');

                        //yahan
                    }
                    else {
                        $('#footeradlist').removeClass('footend');
                        // $('#loader').addClass('hidediv');

                        globalallads = alladvertise;
                        oneTwoRows(globalallads);

                    }
                    // globalallads = alladvertise;
                    // oneTwoRows(globalallads);
                })
            // // console.log(alladvertiseObject);
            // oneTwoRows(alladvertiseObject);
        }
        else if (keyword != "" && city == "All-Pakistan") {


            var keywordel = document.getElementById("keyword")
            keywordel.value = keyword;

            var cat;
            cat = category.replace(/-/g, " ");
            resultUpdate.innerHTML = "Result for " + cat;

            var object = [];
            var highestPeriority = 0;

            keyword = keyword.toUpperCase();
            var fields = keyword.split(/-/);
            console.log(fields.length);

            db.collection('ads').where('Catogery', '==', category).get()
                .then((docs) => {
                    docs.forEach((doc) => {
                        var periority = 0;
                        var adtitle = doc.data().Title;
                        adtitle = adtitle.toUpperCase();
                        adtitle = adtitle.split(/\s/g);

                        console.log(adtitle.length);

                        for (var y = 0; y < fields.length; y++) {
                            for (var a = 0; a < adtitle.length; a++) {
                                if (adtitle[a] == fields[y]) {
                                    periority++;
                                }

                            }
                        }

                        if (periority != 0) {
                            var currentAd = new Adlistarray(doc.data().Title, doc.data().Price, doc.data().Price, doc.data().Url, doc.id);

                            object.push(periority, currentAd);

                            if (periority > highestPeriority) {
                                highestPeriority = periority;
                            }
                        }
                    })
                })
                .then(() => {
                    for (var i = highestPeriority; i >= 1; i--) {
                        for (var j = 0; j < object.length; j = j + 2) {
                            if (i == object[j]) {
                                alladvertise.push(object[j + 1]);
                            }
                        }
                    }


                    // globalallads = alladvertise;
                    // oneTwoRows(globalallads);
                    if (alladvertise.length == 0) {
                        document.querySelector('#funccheck').innerHTML = "No Ads Found";
                        console.log("ye kya horaha hai");
                        $('#loader').addClass('hidediv');

                        //yahan
                    }
                    else {
                        $('#footeradlist').removeClass('footend');
                        // $('#loader').addClass('hidediv');

                        globalallads = alladvertise;
                        oneTwoRows(globalallads);

                    }
                })

        }
        else if (keyword != "" && city != "All-Pakistan") {


            var cat, citi;
            cat = category.replace(/-/g, " ");
            citi = city.replace(/-/g, " ");
            resultUpdate.innerHTML = cat + " in " + citi;

            var keywordel = document.getElementById("keyword")
            keywordel.value = keyword;

            var object = [];
            var highestPeriority = 0;
            keyword = keyword.toUpperCase();
            var fields = keyword.split(/-/);
            console.log(fields.length);

            db.collection('ads').where('Catogery', '==', category).where('City', '==', city).get()
                .then((docs) => {
                    docs.forEach((doc) => {
                        var periority = 0;
                        var adtitle = doc.data().Title;
                        adtitle = adtitle.toUpperCase();
                        adtitle = adtitle.split(/\s/g);

                        console.log(adtitle.length);

                        for (var y = 0; y < fields.length; y++) {
                            for (var a = 0; a < adtitle.length; a++) {
                                if (adtitle[a] == fields[y]) {
                                    periority++;
                                }

                            }
                        }

                        if (periority != 0) {
                            var currentAd = new Adlistarray(doc.data().Title, doc.data().Price, doc.data().Price, doc.data().Url, doc.id);

                            object.push(periority, currentAd);

                            if (periority > highestPeriority) {
                                highestPeriority = periority;
                            }
                        }
                    })
                })
                .then(() => {
                    for (var i = highestPeriority; i >= 1; i--) {
                        for (var j = 0; j < object.length; j = j + 2) {
                            if (i == object[j]) {
                                alladvertise.push(object[j + 1]);
                            }
                        }
                    }


                    // globalallads = alladvertise;
                    // oneTwoRows(globalallads);
                    if (alladvertise.length == 0) {
                        document.querySelector('#funccheck').innerHTML = "No Ads Found";
                        console.log("ye kya horaha hai");
                        $('#loader').addClass('hidediv');

                        //yahan
                    }
                    else {
                        $('#footeradlist').removeClass('footend');
                        // $('#loader').addClass('hidediv');

                        globalallads = alladvertise;
                        oneTwoRows(globalallads);

                    }
                })

        }

    }
    else {
        window.location.assign("index.html");
    }


}


function Adlistarray(title, price, date, imgurl, adurl) {
    this.title = title,
        this.price = price,
        this.date = date,
        this.imgurl = imgurl,
        this.adurl = adurl
}


///////-----------------------------------------------------------------------------------------------------

//addetails
function addetailpage(adurl) {
    // UNCOMMENT FOR NORMAL LOCALSTORAGE WAY
    // document.querySelector('#funccheck').innerHTML=para.value;
    // console.log("shahbash chalo");
    // localStorage.setItem('adurl', adurl);
    // window.location.assign("addetail.html");

    // GETTING AD URL FORM URL HASH 
    window.location.assign(`addetail.html#${adurl}`);
}
var uploaderid = "none";
var adid = "none"
function loadDataDetail() {
    // UNCOMMENT FOR NORMAL LOCALSTORAGE WAY

    // var adurl = localStorage.getItem('adurl');
    // adid = adurl;
    // 0wS5ILw35hmU9yIgsRY8

    // GETTING AD URL FORM URL HASH 
    var hash = location.hash.substr(1);
    adurl = hash;
    console.log(adurl);
    adid = adurl;

    // GETTING AD URL FORM URL HASH UN COMM

    // 
    // .then((snapshot) => {
    //     snapshot.forEach((doc) => {
    //         console.log(doc.id)
    //     })
    // 


    var favadel = document.getElementById("favad");
    favadel.setAttribute("onclick", `favClickFunc(${adid},this);`)



    db.collection('ads').doc(adurl).get()
        .then((doc) => {
            uploaderid = doc.data().Uploader;
            adid = doc.id;
            document.querySelector('#detailName').innerHTML = doc.data().Name;
            document.querySelector('#detailCity').innerHTML = doc.data().City;
            document.querySelector('#detailPrice').innerHTML = doc.data().Price;
            document.querySelector('#detailemail').innerHTML = doc.data().Email;
            document.querySelector('#detailcategory').innerHTML = doc.data().Catogery;
            document.querySelector('#detailModel').innerHTML = doc.data().Model;
            document.querySelector('#detailDate').innerHTML = doc.data().Time;
            document.querySelector('#detailMob').innerHTML = doc.data().Mobile;
            document.querySelector('#detailDescription').innerHTML = doc.data().adDisc;
            document.querySelector('#detailimg').src = doc.data().Url;
            document.querySelector('#detailTitle').innerHTML = doc.data().Title;
        })


        .then(() => {
            auth.onAuthStateChanged(function (user) {
                if (user) {
                    var user = auth.currentUser;
                    if (user.uid == uploaderid) {
                        console.log("khud kuch karna parega");
                        var btn = document.querySelector('#chatbtn');
                        btn.setAttribute("onClick", `window.location.assign('adpost.html?${adurl}')`)
                        btn.innerHTML = "Update Ad";
                        btn.setAttribute("class", "btn btn-danger");
                        // window.location.assign(`adpost.html?${adurl}`);

                        // var detaildivid = 
                        $('#detaildivid').removeClass('hidediv');
                        $('#loader').addClass('hidediv');
                        $('#detailfoot').removeClass('footend');



                    }
                }

            });
        })


}
function appendivFunc(advertise, i) {

    console.log(advertise);

    var no = i;

    var divM = document.getElementById(`div${no}`);

    if (advertise == undefined) {
        divM.setAttribute("style", "display:none;")
    }

    else {
        var divOnClick = document.getElementById(`div${no}onclick`);
        var divHeading = document.getElementById(`div${no}heading`);
        var imgTag = document.getElementById(`div${no}img`);
        var divFooter = document.getElementById(`div${no}footer`);



        var iTag = document.createElement("i");

        iTag.setAttribute("id", `div${no}i`)
        iTag.setAttribute("class", `favdiv glyphicon glyphicon-heart`)
        iTag.setAttribute("title", `Add to favourits`);

        // const iTag = document.getElementById(`div${no}i`);



        iTag.addEventListener("load", favFunc(no, advertise.adurl));


        iTag.setAttribute("onClick", `event.stopPropagation(); favClickFunc('${advertise.adurl}',this);`);

        divOnClick.setAttribute("onClick", `addetailpage('${advertise.adurl}')`);

        divHeading.innerHTML = advertise.title;

        imgTag.setAttribute("src", `${advertise.imgurl}`)


        var br = document.createElement("br");
        divFooter.innerHTML = "";
        divFooter.appendChild(br);
        divFooter.appendChild(iTag);

        divFooter.innerHTML = "Price :" + advertise.price + divFooter.innerHTML + " Date:" + advertise.date;





    }
}


function pageConstructor(ref) {

    ref = parseInt(ref);
    console.log(ref);

    console.log(alladvertisearray);

    var adCount = ref * 12;

    console.log(alladvertisearray[adCount]);

    var couner = 0;
    for (var i = 0; i < 12; i++) {

        console.log(++couner);
        appendivFunc(alladvertisearray[adCount], i + 1);
        adCount++;
    }
    console.log("idher");
    // yasirrrrr 
    $('#maincontainer0').removeClass('hidediv');

    $('#loader').addClass('hidediv');
    console.log("lays or hum");

    $('#footeradlist').removeClass('footend');
}

function displayAll() {
    for (var i = 0; i < 12; i++) {
        var no = 1 + i;
        var divM = document.getElementById(`div${no}`);
        divM.setAttribute("style", "display:auto;")
    }
}

var alladvertisearray = [];

function oneTwoRows(alladvertise) {



    alladvertisearray = alladvertise;
    console.log(alladvertisearray);


    var maindivel = document.querySelector('#maincontainer0');

    var arraylength = alladvertise.length;

    console.log(arraylength);


    var noOfRows = Math.ceil(arraylength / 3);
    var noofpages = Math.ceil(noOfRows / 4);

    console.log(noOfRows);
    console.log(noofpages);


    for (var i = 0; i < noofpages; i++) {

        var btn = document.createElement("button");
        btn.setAttribute("class", "btn btn-info btn-right")
        btn.innerHTML = i + 1;
        btn.setAttribute("onclick", `displayAll(); pageConstructor('${i}'); topFunction();`);
        maindivel.appendChild(btn);

    }
    pageConstructor(0)
    topFunction();

}

function topFunction() {

    $('html, body').animate({ scrollTop: 0 }, 'fast');
}

function favClickFunc(curretAdlink, elRef) {

    console.log("sir ap");

    var flag = false;

    db.collection("users")
        .doc(universalUID)
        .collection("fav")
        .get()
        .then({ includeMetadataChanges: true }, function (doc) {
            doc.forEach((res) => {
                var val = res.data();
                if (curretAdlink == val.favads) {
                    // console.log();

                    flag = true;
                    elRef.style.color = "grey";
                    elRef.setAttribute("title", "Add to Favourites");
                    res.ref.delete()

                        .then(() => {
                            var pageRef;
                            var pageName = window.location.href;
                            pageRef = pageName.substr(pageName.indexOf('?') + 1);
                            console.log(pageRef);
                            if (pageRef == "favads") {

                                window.location.assign("adlist.html?favads");

                            }
                            var source = snapshot.metadata.fromCache ? "local cache" : "server";
                            console.log("Data came from " + source);
                        })

                }

                // if (pageRef == "favads") {

                //     window.location.assign("adlist.html?favads");
                // }
            })
        })
        .then(() => {
            if (flag == false) {
                console.log("pouchgaya");
                db.collection('users')
                    .doc(universalUID)
                    .collection("fav")
                    .doc()
                    .set({ favads: curretAdlink })
            }
        })
    // favFunc(elRef, curretAdlink)


}

function favFunc(no, favAdlink) {


    db.collection("users")
        .doc(universalUID)
        .collection("fav")
        .onSnapshot(function (doc) {
            doc.forEach((res) => {
                var val = res.data();
                if (favAdlink == val.favads) {

                    console.log(no);
                    const iTag = document.getElementById(`div${no}i`);
                    iTag.style.color = "red";
                    iTag.title = "Remove from ads";


                }

            })
        })

}

function timeinmili() {
    var time = new Date();
    time = time.getTime();
    return time;
}

function createroom() {

    // console.log("room created");
    var time = timeinmili()
    roomid;
    // db.collection.('rooms')

    db.collection('rooms').get()
        .then((snapshot) => {
            snapshot.forEach((doc) => {
                var obj = doc.data();
                // console.log(Object.keys(obj)) // array of keys
                var objarr = Object.keys(obj);//  
                objarr.forEach(a => {
                    if (a == universalUID && doc.data().adid == adid) {
                        console.log(doc.id);
                        localStorage.setItem("roomid", doc.id);
                        window.location.assign("chat.html?" + doc.id);
                    }

                    // else {
                    //     db.collection("rooms").add({})
                    //         .then(function (res) {
                    //             console.log(res.id);
                    //             roomid = res.id;
                    //             db.collection('rooms')
                    //                 .doc(res.id)
                    //                 .set({ [uploaderid]: true, [universalUID]: true, roomcreatedate: time, adid: adid })
                    //             // localStorage.setItem("roomid", roomid);
                    //             // window.location.assign("chat.html?" + roomid);

                    //         })

                    // }
                });

            })
        })

    db.collection("rooms").add({})
        .then(function (res) {
            console.log(res.id);
            roomid = res.id;
            db.collection('rooms')
                .doc(res.id)
                .set({ [uploaderid]: true, [universalUID]: true, roomcreatedate: time, adid: adid })
            localStorage.setItem("roomid", roomid);
            window.location.assign("chat.html?" + roomid);

        })
    // db.collection("rooms").add({})
    //     .then(function (res) {
    //         console.log(res.id);
    //         roomid = res.id;
    //         db.collection('rooms')
    //             .doc(res.id)
    //             .set({ [uploaderid]: true, [universalUID]: true, roomcreatedate: time, adid: adid })

    //         localStorage.setItem("roomid", roomid);
    //         window.location.assign("chat.html");

    //     })
}

//  javascript for chat room

var roomid;
var chatadurl;

function chatload() {

    console.log("we here");
    roomid = window.location.href;
    roomid = roomid.substr(roomid.indexOf('?') + 1);


    db.collection('rooms').doc(roomid)
        .get().then(function (doc) {

            chatadurl = doc.data().adid;
            var obj = doc.data();
            // console.log(Object.keys(obj)) // array of keys

            var objarr = Object.keys(obj);//  
            var found = 0;
            objarr.forEach(a => {
                if (a == universalUID) {
                    found = 1
                    console.log("dusra bnda yehi hai");
                    // var noofmsgs;
                    // db.collection("rooms").doc(roomid)
                    //     .collection("msgs").get()
                    //     .then((res) => {
                    //         console.log(res.size);
                    //         noofmsgs = res.size;

                    // if (noofmsgs == 0) {

                    //     var adurl;
                    //     db.collection("rooms")
                    //         .doc(roomid).get()
                    //         .then((res) => {
                    //             console.log(res.data().adid)
                    //             adurl = res.data().adid;

                    //         })

                    // var msg = "click here to view ad";
                    // // var msgtime = timeinmili();
                    // var msgtime = new Date();
                    // db.collection('rooms')
                    //     .doc(roomid)
                    //     .collection("msgs")
                    //     .doc()
                    //     .set({ senderId: true, recieverId: true, msgcreatedate: msgtime, msg: msg })



                    //     }
                    // else {

                    var viewadref = document.getElementById("viewad");
                    viewadref.setAttribute("onClick", `window.location.assign('addetail.html#${chatadurl}')`);

                    $('#viewad').removeClass('hidediv');
                    db.collection('rooms')
                        .doc(roomid)
                        .collection("msgs").orderBy("msgcreatedate")
                        .onSnapshot
                        (function (querySnapshot) {
                            querySnapshot.docChanges().forEach(function (change) {
                                if (change.type === "added") {

                                    if (change.doc.data().senderId == true && change.doc.data().recieverId == true) {
                                        console.log("bhand hogaya");

                                        loadchatmessages(change.doc.data().msg, change.doc.data().msgcreatedate, chatadurl);
                                    }
                                    else if (change.doc.data().senderId == universalUID) {
                                        loadchatmessages(change.doc.data().msg, change.doc.data().msgcreatedate, "sender");
                                    }
                                    else {
                                        loadchatmessages(change.doc.data().msg, change.doc.data().msgcreatedate, "reciever");
                                    }
                                }
                            })
                        })
                    // }
                    // })
                }


                if (found == 0) {

                    db.collection("rooms").doc(roomid).get().then((doc) => {
                        window.location.assign("addetail.html#" + doc.data().adid);
                    })

                }
            })

        })



}


var recieverIdchat;
var token;

function chat() {

    var msg = document.getElementById("msgid").value;
    var testid = "2123";
    var msgtime = timeinmili();

    // reciver id for notification
    db.collection('rooms').doc(roomid)
        .get().then(function (doc) {
            console.log(doc.data());
            var obj = doc.data();
            //  console.log(Object.keys(obj)) // array of keys
            var objarr = Object.keys(obj);// 
            console.log(objarr);
            objarr.forEach(a => {
                // console.log(a);

                if (a != universalUID && obj[a] == true) {
                    recieverIdchat = a;
                    console.log(a);
                    console.log(recieverIdchat);
                    // get token of reciever 
                    db.collection('users').doc(recieverIdchat)
                        .get().then((doc) => {
                            token = doc.data().token;
                            // console.log(token);
                            pushnotification(token, roomid);
                        })
                    // get token of reciever 

                }
            })
        })
    // reciver id for notification



    db.collection('rooms')
        .doc(roomid)
        .collection("msgs")
        .doc()
        .set({ senderId: universalUID, recieverId: true, msgcreatedate: msgtime, msg: msg })
    msg = document.getElementById("msgid").value = '';
}

function loc(adurl) {

    window.location.assign(`addetail.html#${adurl}`);
}


function loadchatmessages(txt, date, personstatus) {


    if (personstatus == "sender") {

        var appenddiv = document.getElementById("messagedivinside");

        var div1 = document.createElement("div");
        div1.setAttribute("class", "container-fluid");

        var div2 = document.createElement("div");
        div2.setAttribute("class", "chatmsg msgsender pull-right");

        var para = document.createElement("p");

        date = new Date(date);

        para.innerHTML = txt + "<br>" + date;


        div2.appendChild(para);
        div1.appendChild(div2);
        appenddiv.appendChild(div1);
    }
    else if (personstatus == "reciever") {

        var appenddiv = document.getElementById("messagedivinside");

        var div1 = document.createElement("div");
        div1.setAttribute("class", "container-fluid");

        var div2 = document.createElement("div");
        div2.setAttribute("class", "chatmsg msgreciever");

        var para = document.createElement("p");

        date = new Date(date);
        date.toLocaleString();
        // var time;
        // time=date.slice(4, 20);

        para.innerHTML = txt + "<br>" + date;

        div2.appendChild(para);
        div1.appendChild(div2);
        appenddiv.appendChild(div1);

    }
    else {

        var appenddiv = document.getElementById("messagedivinside");
        var div1 = document.createElement("div");
        div1.setAttribute("class", "container-fluid");

        var div2 = document.createElement("div");
        div2.setAttribute("class", "chatmsg msgdefault");
        div2.setAttribute("onclick", `loc('${personstatus}')`);

        var para = document.createElement("p");

        date = new Date(date);
        date.toLocaleString();
        // var time;
        // time=date.slice(4, 20);


        para.innerHTML = txt + "<br>" + date;

        div2.appendChild(para);
        div1.appendChild(div2);
        appenddiv.appendChild(div1);

    }
}

// var recievertoken = "ezopOxwABkQ:APA91bGiTdzudHEhWBzb3O-mon3mRUeUNLVwDzYTLXFRkKNLGtxFaEaflWq5RsPA1QV8ynAzmIcToVLVLu0fFTWTZKsYCo3nm8ov-edoFEGhnlKPKav_l33AKlZcSUBgW6Ss3hF8eNoP";

// pushnotification(recievertoken);


function pushnotification(token, roomid) {
    ////Server Key (Firebase -> Project -> Settings -> Cloud Messaging -> Server Key
    // apni dhondo
    var key = 'AIzaSyCXmDty3kx8N3dkj96IdtCq0bRIlpK5iwQ';
    //token
    var to = token;
    console.log("pouch  gaya sir :p");
    var notification = {
        'title': 'New message',
        'body': 'click to view',
        'click_action': "chat.html?" + roomid

    };

    fetch('https://fcm.googleapis.com/fcm/send', {
        'method': 'POST',
        'headers': {
            'Authorization': 'key=' + key,
            'Content-Type': 'application/json'
        },
        'body': JSON.stringify({
            'notification': notification,
            'to': to
        })
    }).then(function (response) {
        console.log(response);
    }).catch(function (error) {
        console.error(error);
    });
}


function tokenstore() {
    // console.log(universalUID);
    // token database mein 0 save karwaya hai 1st login per wo is function se set kar raha hon
    db.collection('users').doc(universalUID)
        .get().then(function (doc) {
            if (doc.data().token == 0) {
                messaging.requestPermission()
                    .then(function () {
                        console.log('Notification permission granted.');
                        // console.log(messaging.getToken());
                        return messaging.getToken()
                    }).then(function (currentToken) {

                        console.log(currentToken + "token aawegayo");

                        var batch = db.batch();

                        // Update the token
                        var sfRef = db.collection("users").doc(universalUID);
                        batch.update(sfRef, { "token": currentToken });
                        console.log(currentToken);

                        // Commit the batch
                        batch.commit().then(function () {
                            console.log("shahbash chalo");
                        });
                    }).catch(function (err) {
                        console.log('Unable to get permission to notify.', err);
                    });
                messaging.onMessage((payload) => {
                    console.log('payload', payload)
                })
            }
        })
}

// search btn work 
//fazool hogaya hai last day
// function catogoryselect(a) {
//     console.log(a.innerHTML);
//     document.getElementById('dropdown-catogory-btn').innerHTML = a.innerHTML;
// }


function searchbtn() {
    // para = para.replace(/\s/g, "-");
    var adcityel = document.getElementById("ad-city").value;
    var keywordel = document.getElementById("keyword").value;
    var category = document.getElementById('ad-category').value;


    if (category != "Select Category") {
        var ref;
        category = category.replace(/\s/g, "-");
        adcityel = adcityel.replace(/\s/g, "-");
        keywordel = keywordel.replace(/\s/g, "-");

        ref = category + "~" + adcityel + "~" + keywordel;
        window.location.assign(`adlist.html?${ref}`);
    }

    else {
        var ref = document.getElementById("catogeryAlert");
        ref.setAttribute("style", "display:block;");
        setTimeout(() => {
            ref.setAttribute("style", "display:none;");

        }, 3000)

    }
    // else if (adcityel == "All Pakistan" && category != "Select Category") {
    //     category = category.replace(/\s/g, "-");
    //     window.location.assign(`adlist.html?${category}`);
    // }
    // else if (adcityel != "All Pakistan" && category != "Select Category") {
    //     // window.location.assign(`adlist.html?${category}`);

    //     category = category.replace(/\s/g, "-");

    //     category += "=" + adcityel;
    //     alert(category);

    //     //    var link= `adlist.html?${category}`;

    //     //     var fields = link.split(/=/);
    //     //     var one = fields[0];
    //     //     var two = fields[1];
    //     //     var three= fields[2];
    //     //     alert(one);
    //     //     alert(two);
    //     //     alert(three);

    // }
}

function currentDateTime() {
    var date = new Date();
    date = '"' + date + '"';
    var length = 22;
    var finaldate = date.substring(1, length);
    return finaldate;
}



// function adcontroller(a) {
//     var adspages = Math.ceil(a / 6);
//     var adcontrollerdiv = document.querySelector('#adcontrollers');


//     for (i = 0; i < adspages; i++) {
//         var btn = document.createElement("button");
//         btn.innerHTML = i + 1;
//         adcontrol///lerdiv.appendChild(btn);
//     }
// }

// alert(adcontroller(13));


// db.collection("msg")
//     .doc('4PriIDn5XThmyUVbNFj3GKFj3aU2')
//     .set({ sender: emailEL, username: nameEl })

// auth.onAuthStateChanged(function (user) {
//     if (user) {




//         // var user = auth.currentUser;
//         // console.log(user.uid);
//     }
// })

function updateAd() {


    auth.onAuthStateChanged(function (user) {
        if (user) {
            var user = auth.currentUser;
            user = user.uid;

            var pageRef;
            var pageName = window.location.href;
            pageRef = pageName.substr(pageName.indexOf('?') + 1);
            console.log(pageRef);

            db.collection('ads').doc(pageRef)
                .onSnapshot((doc) => {
                    console.log(doc.data().Uploader);

                    if (doc.data().Uploader == user) {
                        console.log("ka baat hai");

                        // adid = doc.id;
                        // document.querySelector('#detailName').innerHTML = doc.data().Name;
                        // document.querySelector('#detailCity').innerHTML = doc.data().City;
                        // document.querySelector('#detailPrice').innerHTML = doc.data().Price;
                        // document.querySelector('#detailemail').innerHTML = doc.data().Email;
                        // document.querySelector('#detailcategory').innerHTML = doc.data().Catogery;
                        // document.querySelector('#detailModel').innerHTML = doc.data().Model;
                        // document.querySelector('#detailDate').innerHTML = doc.data().Time;
                        // document.querySelector('#detailMob').innerHTML = doc.data().Mobile;
                        // document.querySelector('#detailDescription').innerHTML = doc.data().adDisc;
                        // document.querySelector('#detailimg').src = doc.data().Url;
                        // document.querySelector('#detailTitle').innerHTML = doc.data().Title;


                        document.querySelector('#ad-title').value = doc.data().Title;
                        document.querySelector('#your-name').value = doc.data().Name;
                        document.querySelector('#your-emailid').value = doc.data().Email;
                        document.querySelector('#your-mobile').value = doc.data().Mobile;
                        document.querySelector('#ad-city').value = doc.data().City;
                        document.querySelector('#opt-cat').value = doc.data().Catogery;
                        document.querySelector('#priceid').value = doc.data().Price;
                        document.querySelector('#modelid').value = doc.data().Model;
                        document.querySelector('#ad-disc').value = doc.data().adDisc;
                        let img = document.createElement('img')
                        img.src = doc.data().Url;
                        document.getElementById('gallery').innerHTML = "";

                        document.getElementById('gallery').appendChild(img)

                        document.getElementById('lablimg').innerHTML = "Replace Image";

                        document.getElementById('legendh1').innerHTML = "UPDATE AD";


                        document.getElementById('submitbtn').setAttribute("onclick", "updateAdBtn()");
                        document.getElementById('submitbtn').setAttribute("class", "btn btn-danger");
                        document.getElementById('submitbtn').innerHTML = 'Update <span class="glyphicon glyphicon-send"></span>';

                        $('#loader').addClass('hidediv');
                        // allcontent
                        document.getElementById('allcontent').setAttribute("style", "visibility:visible;")
                    }

                    else {

                        window.location.assign("adpost.html");
                    }

                })

        }
    })
}

function updateAdBtn() {

    var pageRef;
    var pageName = window.location.href;
    pageRef = pageName.substr(pageName.indexOf('?') + 1);
    console.log(pageRef);



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



    var refrence = db.collection("ads").doc(pageRef);


    var files = document.getElementById('fileElem').files || document.getElementById('fileElem').dataTransfer.files;
    console.log(files.length);


    if (files.length != 0) {
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
                    refrence.update({
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
                .then(() => {
                    console.log("updated");
                })
        }

    }

    else if (files.length == 0) {
        return refrence.update({
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
            Uploader: universalUID,

        })
            .then(() => {
                console.log("updated");
            })
    }
}


function loadRooms() {
    var maindivel = document.getElementById("messagedivinside");

    db.collection('rooms').where(universalUID, "==", true).get()
        .then((snapshot) => {
            snapshot.forEach((doc) => {
                // console.log(doc.data().adid);
                // console.log(doc.id);

                var div1 = document.createElement("div");

                var btn1 = document.createElement("p");

                btn1.setAttribute("class", "btn ");

                div1.setAttribute("onclick", ` addetailpage('${doc.data().adid}')`);

                var btn2 = document.createElement("p");
                btn2.innerHTML = 'view chat  <i class="fa fa-envelope"></i>';

                btn2.setAttribute("class", " btn btn-default");

                btn2.setAttribute("onClick", `event.stopPropagation(); window.location.assign('chat.html?${doc.id}')`);

                // var btn3 = document.createElement("p");
                // btn3.innerHTML = 'Title';

                // btn3.setAttribute("class", "btn btn-default");

                db.collection('ads').doc(doc.data().adid).get()
                    .then((doc) => {

                        console.log(doc.data().Title);

                        btn1.innerHTML = "hostel jesa hai wesa nh hai  " + doc.data().Title;
                    })

                div1.setAttribute("class", "btn-default borderbtm container-fluid margin-btm");


                // event.stopPropagation();

                // var btn1 = document.createElement("button");
                // btn1.innerHTML = "view Ad";
                // btn1.setAttribute("class","btn btn-success")
                // div1.appendChild(btn3);

                div1.appendChild(btn1);
                div1.appendChild(btn2);
                maindivel.appendChild(div1);
            })

        })
}



firebase.firestore().enablePersistence()
    .then(function () {
        console.log("offline presisitance");
    })
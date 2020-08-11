//EFFECT FIELD FLAGS
var effect1Full = false;
var effect2Full = false;
var effect3Full = false;

//EFFECT HEADING DEFAULTS
var effect1Name = "Chosen Effect 1";
var effect2Name = "Chosen Effect 2";
var effect3Name = "Chosen Effect 3";

//ADDING EVENT LISTENERS
//effect-adding buttons
$(".effect-button").on("click", buttonClicked);

//submit button
$("#submitButton").on("click", function() {

  var btn1 = $("#chosenEffect1").text();
  var btn2 = $("#chosenEffect2").text();
  var btn3 = $("#chosenEffect3").text();

  //retrieving elements from the page
  var outputField = document.getElementById("out");
  var effect1Array = getEffectArray(btn1);
  var effect2Array = getEffectArray(btn2);
  var effect3Array = getEffectArray(btn3);
  var ingredientList = [];

  //checking for common ingredients between each effect
  var ings12 = findCommonIngredients(effect1Array, effect2Array);
  var ings13 = findCommonIngredients(effect1Array, effect3Array);
  var ings23 = findCommonIngredients(effect2Array, effect3Array);
  var ingsAll = findCommonIngredients(ings12, effect3Array);

  //put ingredients list into each respective output field
  setHeadings();

  //effect1 output
  if (effect1Array.length > 0) {
    for (var i = 0; i < effect1Array.length; i++) {
      if(ings12.includes(effect1Array[i]) || ings13.includes(effect1Array[i]) || ings23.includes(effect1Array[i])) {
        $("#effectOut1").append("<li class='highlighted'>" + effect1Array[i] + "</li>");
      }
      else {
        $("#effectOut1").append("<li>" + effect1Array[i] + "</li>");
      }
    }
  }

  //effect2 output
  if (effect2Array.length > 0) {
    for (var i = 0; i < effect2Array.length; i++) {
      if(ings12.includes(effect2Array[i]) || ings13.includes(effect2Array[i]) || ings23.includes(effect2Array[i])) {
        $("#effectOut2").append("<li class='highlighted'>" + effect2Array[i] + "</li>");
      }
      else {
        $("#effectOut2").append("<li>" + effect2Array[i] + "</li>");
      }
    }
  }

  //effect3 output
  if (effect3Array.length > 0) {
    for (var i = 0; i < effect3Array.length; i++) {
      if(ings12.includes(effect3Array[i]) || ings13.includes(effect3Array[i]) || ings23.includes(effect3Array[i])) {
        $("#effectOut3").append("<li class='highlighted'>" + effect3Array[i] + "</li>");
      }
      else {
        $("#effectOut3").append("<li>" + effect3Array[i] + "</li>");
      }
    }
  }

  //combined 1 and 2 output
  if (ings12.length > 0) {
    $("#combined-heading-12").removeClass("hidden");
    for (var i = 0; i < ings12.length; i++) {
      //if a common ingredient across all 3 effects, don't display under this heading
      if(!ingsAll.includes(ings12[i])) {
        $("#combinedOut1").append("<li>" + ings12[i] + "</li>");
      }
      else {
        $("#combined-heading-12").addClass("hidden");
      }
    }
  }

  //combined 1 and 3 output
  if (ings13.length > 0) {
    $("#combined-heading-13").removeClass("hidden");
    for (var i = 0; i < ings13.length; i++) {
      if(!ingsAll.includes(ings13[i])) {
        $("#combinedOut2").append("<li>" + ings13[i] + "</li>");
      }
      else {
        $("#combined-heading-13").addClass("hidden");
      }
    }
  }

  //combined 2 and 3 output
  if (ings23.length > 0) {
    $("#combined-heading-23").removeClass("hidden");
    for (var i = 0; i < ings23.length; i++) {
      if(!ingsAll.includes(ings23[i])) {
        $("#combinedOut3").append("<li>" + ings23[i] + "</li>");
      }
      else {
        $("#combined-heading-23").addClass("hidden");
      }
    }
  }

  //combined all output
  if (ingsAll.length > 0) {
    $("#combined-heading-all").removeClass("hidden");
    for (var i = 0; i < ingsAll.length; i++) {
      $("#combinedOutAll").append("<li>" + ingsAll[i] + "</li>");
    }
  }

})

//reset button
//reset all changable values on page and reset variables and flags
$("#resetButton").on("click", function() {
  effect1Full = false;
  effect2Full = false;
  effect3Full = false;
  resetButtons();
  $("#effectOut1").html("");
  $("#effectOut2").html("");
  $("#effectOut3").html("");
  $("#combinedOut1").html("");
  $("#combinedOut2").html("");
  $("#combinedOut3").html("");
  $(".no-results-text").remove();
  effect1Name = "Chosen Effect 1";
  effect2Name = "Chosen Effect 2";
  effect3Name = "Chosen Effect 3";
  setHeadings();
})

//functionality which grays out any effects with no common ingredients with your selected effects
function setInvalidButtons() {
    $(".effect-button").each(function() {
      // retrieve info about each button and disable by default
      var scannedBtn = $(this);
      var btnArray = getEffectArray(scannedBtn.text());
      scannedBtn.addClass("incompatible");

      // if effect has common ingredients with a selected effect then re-enable the button
      $(".chosen-effect-btn").each(function() {
        var chosenBtn = $(this);
        var chosenArray = getEffectArray(chosenBtn.text());
        var commonIngs = findCommonIngredients(btnArray, chosenArray);
        if (commonIngs.length > 0) {
          scannedBtn.removeClass("incompatible");
        }
      })
    })
}


//sets effect headings to the values currently head for them
function setHeadings() {
  $("#effect-heading-1").text(effect1Name);
  $("#effect-heading-2").text(effect2Name);
  $("#effect-heading-3").text(effect3Name);
  $("#combined-heading-12").text(effect1Name + " and " + effect2Name);
  $("#combined-heading-13").text(effect1Name + " and " + effect3Name);
  $("#combined-heading-23").text(effect2Name + " and " + effect3Name);
}

// reset button styles and classes to their defaults
function resetButtons() {
  $(".effect-button").removeClass("disabled incompatible");
  $(".effect-button").prop("disabled", false);
  $("#chosenEffect1").text("");
  $("#chosenEffect1").addClass("invisible");
  $("#chosenEffect2").text("");
  $("#chosenEffect2").addClass("invisible");
  $("#chosenEffect3").text("");
  $("#chosenEffect3").addClass("invisible");
  $("#combined-heading-12").addClass("hidden");
  $("#combined-heading-13").addClass("hidden");
  $("#combined-heading-23").addClass("hidden");
  $("#combined-heading-all").addClass("hidden");
}

//takes two arrays and scans them to find common ingredients
function findCommonIngredients(array1, array2) {

  var commonIngredients = [];

  //find longer array to scan through
  var scannedArray = [];
  var unscannedArray = [];
  if (array1.length >= array2.length) {
    scannedArray = array1;
    unscannedArray = array2;
  } else {
    scannedArray = array2;
    unscannedArray = array1;
  }

  //iterate through input array and add any common ingredients to new array
  for (var i = 0; i < scannedArray.length; i++) {
    if (unscannedArray.includes(scannedArray[i])) {
      commonIngredients.push(scannedArray[i]);
    }
  }

  return commonIngredients;
}

//assigns the selected effect to either chosen effect 1 or chosen effect 2 field using boolean flag
//if both are full then return error message and false, else return true
// buttons are created with temporary class so they can be found and deleted on reset
function assignEffect(effectText) {
  if (effect1Full === false) {
    effect1Name = effectText;
    $("#chosenEffect1").text(effectText);
    $("#chosenEffect1").removeClass("invisible");
    effect1Full = true;
    return true;
  } else if (effect2Full === false) {
    effect2Name = effectText;
    $("#chosenEffect2").text(effectText);
    $("#chosenEffect2").removeClass("invisible");
    effect2Full = true;
    return true;
  } else if (effect3Full === false) {
    effect3Name = effectText;
    $("#chosenEffect3").text(effectText);
    $("#chosenEffect3").removeClass("invisible");
    effect3Full = true;
    return true;
  } else {
    alert("Both effects are already assigned");
    return false;
  }
}

//called on button click
// assigns the effect to a chosen effect slot, checks it's compatibility with other effects and disables the button after being clicked
function buttonClicked() {
  var buttonText = this.innerHTML;
  if (assignEffect(buttonText) === true) {
    setInvalidButtons();
    $(this).addClass("disabled");
    $(this).prop("disabled", true);
  }
}

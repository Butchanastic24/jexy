//user.html logic
const firstNameBox = document.getElementById('firstNameBox')
const lastNameBox = document.getElementById('lastNameBox')
const weightBox = document.getElementById('weightBox')
const feetBox = document.getElementById('heightFeet')
const inchesBox = document.getElementById('heightInches')
const ageBox = document.getElementById('ageBox')
const genderBox = document.getElementById('genderBox')
const fitnessGoal = document.getElementById('fitnessGoal')
const submitButton = document.getElementById('userInfoSubmit')
const userInfoWCals = document.getElementById('userInfoCals')

var feet
var inches

async function submitInfo(event) {
    event.preventDefault();

    feet = parseInt(feetBox.value, 10) * 12;
    inches = parseInt(inchesBox.value, 10);
    let totalHeight = feet + inches;


    let body = {
        firstName: firstNameBox.value,
        lastName: lastNameBox.value,
        weight: weightBox.value,
        height: totalHeight,
        age: ageBox.value,
        gender: genderBox.options[genderBox.selectedIndex].value,
        goal: fitnessGoal.options[fitnessGoal.selectedIndex].value
    };

    await axios.post('http://localhost:4004/user', body)
        .then(response => {
            let {userCalories} = response.data;
            calories = Math.floor(userCalories);
        });

    searchName = body.lastName

    //Need to change css from center to space evenly otherwise box will initially begin to the left which looks bad.
    document.getElementsByClassName('mainPage')[0].style.justifyContent = "space-evenly";

    deleteExistingUserCard();
    createUserInfoBox(body, calories);
    clearFormBoxes();
};


function createUserInfoBox(body, calories) {
    const userInfoCard = document.createElement('div');
    userInfoCard.className = "userInfoSection"
    userInfoCard.setAttribute("id", "calsDiv")

    let readeableGoal

    if(body.goal == "buildStrength"){
        readeableGoal = "Build Strength"
    }
    else if(body.goal == "buildEndurance"){
        readeableGoal = "Build Endurance"
    }
    else{
        readeableGoal = "Increase Muscle Mass and Definition"
    }

    feet /= 12;
    
    let genderCapitalized
    if(body.gender == "female"){
        genderCapitalized = "Female"
    }
    else{
        genderCapitalized = "Male"
    }

    userInfoCard.innerHTML = `
    <div id="newInfoTopDiv">
        <h2>${body.firstName} ${body.lastName}</h2>
    </div>
    <div id="newInfoInnerDiv">
        <h5>Weight: ${body.weight}</h5>
        <h5>Height: ${feet}'${inches}</h5>
        <h5>Age: ${body.age}</h5>
        <h5>Sex: ${genderCapitalized}</h5>
        <h5>Goal: ${readeableGoal}</h5>
        <h4>Daily Calories: ${calories}</h4>
    </div>
    `
    userInfoWCals.appendChild(userInfoCard);

};

function deleteExistingUserCard() {
    const elementExists = document.getElementById('calsDiv');

    if(elementExists == null){
        return
    }
    else{
        elementExists.remove();
    }

};

function clearFormBoxes() {
    firstNameBox.value = ''
    lastNameBox.value = ''
    weightBox.value = ''
    feetBox.value = ''
    inchesBox.value = ''
    ageBox.value = ''
    genderBox.selectedIndex = 0;
    fitnessGoal.selectedIndex = 0;
};


submitButton.addEventListener('click', submitInfo);
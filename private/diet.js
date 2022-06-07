
const dietDiv = document.getElementById('dietResources');

var goalId
var dailyCals
var proteinPerc
var carbsPerc
var fatsPerc

async function returnDietResource() {
    await axios.post('http://localhost:4004/diet')
    .then(response => {
        let {selectInfo} = response.data;

        goalId = selectInfo[0].goal_id
        dailyCals = selectInfo[0].daily_calories
        proteinPerc = selectInfo[0].protein_percentage
        carbsPerc = selectInfo[0].carbs_percentage
        fatsPerc = selectInfo[0].fats_percentage
    })

    //There is standard amounts for cals to gram conversions they are:
    //1 gram of protein = 4 calories
    //Same conversion for Carbs
    //1 gram of fat = 9 calories

    let proteinGrams = Math.ceil((dailyCals * proteinPerc) / 4);
    let carbsGrams = Math.ceil((dailyCals * carbsPerc) / 4);
    let fatsGrams = Math.ceil((dailyCals * fatsPerc) / 9);

    addDietBox(proteinGrams, carbsGrams, fatsGrams)
};

function addDietBox(proteinGrams, carbsGrams, fatsGrams) {
    let readeableGoal
    let dietResource
    
    if(goalId == 1){
        readeableGoal = "Build Strength"
    }
    else if(goalId == 2){
        readeableGoal = "Build Endurance"
    }
    else{
        readeableGoal = "Increase Muscle Mass and Definition"
    }

    let dietLink
    if(goalId == 1){
        dietLink = "https://www.healthline.com/nutrition/26-muscle-building-foods#muscle-building-foods"
    }
    else if(goalId == 2){
        dietLink = "https://www.trainingpeaks.com/blog/nutrition-for-endurance-athletes-101/"
    }
    else{
        dietLink = "https://www.mensjournal.com/food-drink/5-best-diets-losing-weight-and-burning-fat/2-low-fat-diet/"
    }
    
    const gramsBox = document.createElement('div')
    gramsBox.className = "userInfoSection";
    gramsBox.setAttribute("id", "calsDiv");

    gramsBox.innerHTML = `
        <div id="newInfoTopDiv">
            <h2>Macros Based Off Fitness Goal</h2>
        </div>
        <div id="newInfoInnerDiv">
            <h5>Goal: ${readeableGoal}</h5>
            <h5>Calories: ${dailyCals}</h5>
            <h5>Grams of Protein: ${proteinGrams}</h5>
            <h5>Grams of Carbs: ${carbsGrams}</h5>     
            <h5>Grams of Fats: ${fatsGrams}</h5>
            <span><h4>Click Here For: </h4><a href="${dietLink}" target="_blank" id="dietNavs">Diet Recommendation</a></span>   
        </div>
    `
    dietDiv.appendChild(gramsBox)
};


document.addEventListener("DOMContentLoaded",  anonFunction = () => {returnDietResource()});

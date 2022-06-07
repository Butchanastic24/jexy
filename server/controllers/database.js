require('dotenv').config()
const {CONNECTION_STRING} = process.env
const Sequelize = require('sequelize')

const sequelize = new Sequelize(CONNECTION_STRING, {
    dialect: "postgres",
    dialectOptions: {
        ssl: {
            rejectUnauthorized: false
        }
    }
})


function seed (req, res) {
    sequelize.query(`
        drop table if exists users;
        drop table if exists fitnessGoals;

        create table fitnessGoals (
            goal_id serial primary key,
            name varchar(100),
            protein_percentage float,
            carbs_percentage float,
            fats_percentage float
        );
        
        create table users (
            user_id serial primary key,
            first_name varchar(50),
            last_name varchar(50),
            weight float,
            height float,
            age integer,
            gender varchar(50),
            goal_id integer,
            daily_calories integer,
            foreign key(goal_id) references fitnessGoals(goal_id)
        );

        insert into fitnessGoals (name, protein_percentage, carbs_percentage, fats_percentage)
            values('buildStrength', 0.40, 0.30, 0.30);
        
        insert into fitnessGoals (name, protein_percentage, carbs_percentage, fats_percentage)
            values('buildEndurance', 0.20, 0.60, 0.20);
        
        insert into fitnessGoals (name, protein_percentage, carbs_percentage, fats_percentage)
            values('increaseMuscleMass', 0.35, 0.50, 0.15);
        
        insert into users (first_name, last_name, weight, height, age, gender, goal_id, daily_calories)
            values('Erin', 'Hing', 59, 168, 24, 'female', 3, 2600);

    `).then(() => {
        console.log('DB seeded!')
        res.sendStatus(200)
    }).catch(err => console.log('error seeding DB', err))
};

var searchName

function addUser(req, res) {
    let {
        firstName,
        lastName,
        weight,
        height,
        age,
        gender,
        goal
    } = req.body;

    searchName = lastName

    const findCalories = (weight, height, age, gender, goal) => {
        //Harris-Benedict Equation uses Metric not imperial so need to convert it
        let metricWeight = weight / 2.205;
        let metricHeight = height * 2.54;
        
        let BMR
       //Using Harris-Benedict Equation to calculate BMR (using latest revision from Mifflin and St Jeor 1990)
        if (gender == "male"){
            BMR = (10 * metricWeight) + (6.25 * metricHeight) - (5 * age) + 5;
        }
        else if(gender == "female"){
            BMR = (10 * metricWeight) + (6.25 * metricWeight) - (5 * age) - 161
        };

        //based off fitness level you multiply your BMR, we will assume light exercise
        let dailyCalories = BMR * 1.375

        //Depending on fitness goal your daily calorie intake may increase
        switch(goal) {
            case "buildStrength": 
                dailyCalories += 500
                break;
            case "buildEndurance":
                //When building endurance you maintain your daily calories
                break;
            case "increaseMuscleMass":
                dailyCalories += 200
                break;
        };

        return dailyCalories;
    };

    let calories = findCalories(weight, height, age, gender, goal)

   
    //Goals go by ID in the DB so need to change it from a string
    let goalForDB
    switch(goal) {
        case "buildStrength": 
            goalForDB = 1
            break;
        case "buildEndurance":
            goalForDB = 2
            break;
        case "increaseMuscleMass":
            goalForDB = 3
            break;
    };

    sequelize.query(`
        insert into users(first_name, last_name, weight, height, age, gender, goal_id, daily_calories)
        values('${firstName}', '${lastName}', ${weight}, ${height}, ${age}, '${gender}', ${goalForDB}, ${calories});`)
        
        .then(dbRes => res.status(200).send({userCalories: calories}))
        .catch(err => console.log(err))
};


function returnLastName(req, res) {

}

function getFitnessMacros(req, res) {

    sequelize.query(`
        select users.goal_id, daily_calories, fitnessGoals.protein_percentage, fitnessGoals.carbs_percentage, fitnessGoals.fats_percentage
        from users
        inner join fitnessGoals on users.goal_id=fitnessGoals.goal_id
        where last_name= '${searchName}';
    `)
    .then(dbRes => {
        console.log('query received')
        res.status(200).send({selectInfo: dbRes[0]})})
    .catch(err => console.log(err))
};

module.exports = {
    seed,
    addUser,
    getFitnessMacros
};
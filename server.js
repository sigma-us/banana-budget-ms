const express = require('express');
const app = express();

//  requires that startDate and numberOfDays be passed in as query params example
//  startDate must be format mm/dd/yyyy
//  http://localhost:8080/bananas?startDate=1/12/2017&numberOfDays=19
app.get('/bananas', (req, res) => {
    let startDate = req.query.startDate.split('/');
    let numberOfDays = parseInt(req.query.numberOfDays);

    if (!startDate || (!numberOfDays && numberOfDays !== 0) || numberOfDays < 0) {
        //has error
        res.status(400).json({
            "Error": "Opps! Looks like you forgot to include required query params or the format is wrong, see example url",
            "Example": "http://localhost:8080/bananas?startDate=1/12/2017&numberOfDays=19"
        })
    } else {
        function daysInMonth(year, month) {
            return new Date(year, month, 0).getDate();
        }
        let startDay = parseInt(startDate[1]);
        let startMonth = parseInt(startDate[0]);
        let startYear = parseInt(startDate[2]);
        let currentDaysInMonth = daysInMonth(startYear, startMonth);
        if (startDate.length !== 3) {
            res.status(400).json({
                "Error": "Opps! Please enter a valid date format",
                "Example": "http://localhost:8080/bananas?startDate=1/12/2017&numberOfDays=19"
            })
        } else if (!startMonth || startMonth < 1 || startMonth > 12) {
            res.status(400).json({
                "Error": "Opps! Please enter a valid month between 1 and 12",
                "Example": "http://localhost:8080/bananas?startDate=1/12/2017&numberOfDays=19"
            })
        } else if (!startDay || startDay < 1 || startDay > currentDaysInMonth) {
            res.status(400).json({
                "Error": `Opps! Please enter a valid day between 1 and ${currentDaysInMonth}`,
                "Example": "http://localhost:8080/bananas?startDate=1/12/2017&numberOfDays=19"
            })
        } else if ((!startYear && startYear !== 0) || startYear < 0 || startDate[2].length > 4) {
            res.status(400).json({
                "Error": "Opps! Please enter a valid year format above 0",
                "Example": "http://localhost:8080/bananas?startDate=1/12/2017&numberOfDays=19"
            })
        } else {


            //  using intergers instead of floats due to float addition issues 
            //  ex. 0.05 + 0.05 + 0.05  returns 0.15000000000000002 when it should be 0.15;
            //  using price chart speeds up processing (we know the valuses already) as opposed to using conditional statements
            let priceChart = {
                1: 05,
                2: 05,
                3: 05,
                4: 05,
                5: 05,
                6: 05,
                7: 05,
                8: 10,
                9: 10,
                10: 10,
                11: 10,
                12: 10,
                13: 10,
                14: 10,
                15: 15,
                16: 15,
                17: 15,
                18: 15,
                19: 15,
                20: 15,
                21: 15,
                22: 20,
                23: 20,
                24: 20,
                25: 20,
                26: 20,
                27: 20,
                28: 20,
                29: 25,
                30: 25,
                31: 25
            }

            let weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

            function dayOfWeek(year, month, day) {
                //  using date-1 because index 1 is February but month 1 is January
                let dateStr = `${months[month - 1]} ${day}, ${year}`;
                return new Date(dateStr).getDay();
            }

            function calculateBudget(year, month, day) {
                let currentMonth = month;
                let currentDay = day;
                let currentYear = year;
                // let currentDaysInMonth = daysInMonth(currentYear, currentMonth);
                let budget = 0;

                function iterateDay() {
                    currentDay += 1;
                    if (currentDay > currentDaysInMonth) {
                        currentDay = 1;
                        currentMonth += 1;
                        currentDaysInMonth = daysInMonth(currentYear, currentMonth)
                        if (currentMonth > 12) {
                            currentMonth = 1;
                            currentYear += 1;
                            currentDaysInMonth = daysInMonth(currentYear, currentMonth)
                        }
                    }
                }

                for (let i = 0; i < numberOfDays; i++) {
                    let weekDay = dayOfWeek(currentYear, currentMonth, currentDay)
                    if (weekDays[weekDay] === "Sunday") { //sunday
                        console.log(`Sunday ; ${currentDay}`)
                        iterateDay()
                        continue;
                    } else if (weekDays[weekDay] === "Saturday") { //saturday
                        console.log(`Saturday : ${currentDay}`)
                        iterateDay()
                        continue;
                    } else { //weekday
                        budget += priceChart[currentDay];
                        console.log(`${priceChart[currentDay]} : ${currentDay}`);
                        iterateDay()
                        continue;
                    }
                }
                //converts interger into desired decimal format
                budget = (budget / 100).toFixed(2);
                return {
                    "Total Cost": `$${budget}`
                }
            }

            let result = calculateBudget(startYear, startMonth, startDay);

            res.status(200).json(result);
        }
    }

})



app.listen('8080', () => {
    console.log('Magic happens on port 8080');
})

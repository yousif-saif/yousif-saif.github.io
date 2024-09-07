const lost = new Audio('https://github.com/yousif-saif/Web_car_game/raw/main/lost.mp3/');
const splash = new Audio("https://github.com/yousif-saif/Web_car_game/raw/main/splash.mp3/")
const click = new Audio("https://github.com/yousif-saif/Web_car_game/raw/main/click.mp3/")
const startEngine = new Audio("https://github.com/yousif-saif/Web_car_game/raw/main/startEngine.mp3/")
const woosh = new Audio("https://github.com/yousif-saif/Web_car_game/raw/main/woosh.mp3")

const gameDiv = document.getElementsByClassName("game")[0]
const backroundImage = document.getElementsByClassName("backroundImage")
const startGameBtn = document.getElementsByClassName("start-btn")[0]
const title = document.getElementsByClassName("title")[0]
const car = document.getElementsByClassName("car")[0]
const copyright = document.getElementsByClassName("copyright")[0]
let water2 = document.getElementsByClassName("water2")

let keys = {};
const setKey = (code) => { keys[code] = true; };
const unsetKey = (code) => { keys[code] = false; };
const isKeyPressed = (code) => keys[code];

const calcDistance = (x1, x2, y1, y2) => { return Math.sqrt((x2 - x1)**2 + (y2 - y1)**2) }
const calcMidPoint = (x1, x2, y1, y2) => { return ((x2 + x1)/2, (y2 + y1)/2) }
const lives = document.getElementsByClassName("lives")[0]
const lostDiv = document.getElementsByClassName("lostDiv")[0]
const restartBtn = document.getElementsByClassName("restart")[0]

const carFromUser = document.getElementsByClassName("carFromUser")[0]
const obstacleFromUser = document.getElementsByClassName("obstacleFromUser")[0]

const settingsBtn = document.getElementsByClassName("settingsBtn")[0]
const settings = document.getElementsByClassName("settings")[0]
const invisableBtn = document.getElementsByClassName("invisableBtn")[0]
const exit = document.getElementsByClassName("exit")[0]

const choices = document.getElementById("choices")

const difficultyText = document.getElementsByClassName("difficultyText")[0]


let easyLevelId;
let mediumLevelId;
let hardLevelId;

let isSettingsOpen = false
let fastLevel = 800
let isLost = false
let livesCount = 5

document.addEventListener('contextmenu', function(e) {
    e.preventDefault()

})


function getRandomNumber(min, max) {
    return parseInt(Math.random() * (max - min) + min)

}


const screenWidth = window.innerWidth
function setAndHandleMobileTouchs(event) {
    const touchX = event.touches[0].clientX

    if (touchX < screenWidth / 2) {
        return "left"

    } else {
        return "right"
        
    }
}

let lastPosistion = "left"

document.addEventListener("touchstart", event => {
    lastPosistion = setAndHandleMobileTouchs(event)
    setKey(lastPosistion)


})


document.addEventListener("touchend", (event) => {
    unsetKey(lastPosistion)

})


function handleImgUpload(e, whatImage) {
    const file = e.target.files[0]
    if (!file) {
        return;

    }

    const allowedTypes = ["image/png", "image/jpg", "image/jpeg", "image/gif"]

    if (!allowedTypes.includes(file.type)) {
        alert("File type is not supported, Please upload an image or gif")
        return;

    }
    
    const reader = new FileReader()

    reader.onload = function(e) {
        whatImage.src = e.target.result

    }

    reader.readAsDataURL(file)

    
}

carFromUser.addEventListener("change", e => {
    handleImgUpload(e, car)
})

obstacleFromUser.addEventListener("change", e => {
    handleImgUpload(e, water2[0])
    handleImgUpload(e, water2[1])

})


exit.addEventListener("click", () => {
    isLost = true
    lives.textContent = 0

})


const userLivesCount = document.getElementsByClassName("livesCount")[0]

invisableBtn.addEventListener("click", () => {
    click.play()
    const info = { duration: 1000, fill: "forwards" }

    if (!isSettingsOpen) {

        if (userLivesCount.value < 1) {
            userLivesCount.value = 1
        }

        startGameBtn.style.display = "none"
        copyright.style.display = "none"
        title.style.display = "none"
    

        settings.style.display = "block"
        isSettingsOpen = true

    } else {
        livesCount = parseInt(userLivesCount.value)

        startGameBtn.style.display = "block"
        copyright.style.display = "block"
        title.style.display = "block"
    
        settings.style.display = "none"
        isSettingsOpen = false

    }

})


const randomNumbersList = []

function waterPosition() {
    let randomNum = getRandomNumber(0, 3)
    const arrayLength = randomNumbersList.length - 1
    const lastTwoNums = arrayLength >= 1 ? randomNumbersList.slice(arrayLength - 1, arrayLength + 1) : [-1, -1]

    if (arrayLength < 1) {
        randomNumbersList.push(randomNum)

    } else {
        while (lastTwoNums[0] === lastTwoNums[1] && lastTwoNums[0] === randomNum) {
            randomNum = getRandomNumber(0, 3)
            
        }

        randomNumbersList.push(randomNum)
    }

    if (randomNum === 0) {
        return "-140px" // left

    } else if (randomNum === 1) {
        return "0px" // middle

    } else if (randomNum == 2) {
        return "140px" // right
    }
}


function checkLose() {
    const carRect = car.getBoundingClientRect()

    const waterRect = water2[0].getBoundingClientRect()
    const waterRect2 = water2[1].getBoundingClientRect()


    const carX = carRect.x
    const carY = carRect.y

    const waterX = waterRect.x
    const waterY = waterRect.y

    const waterX2 = waterRect2.x
    const waterY2 = waterRect2.y

    const dist = calcDistance(carX, waterX, carY, waterY)
    const dist2 = calcDistance(carX, waterX2, carY, waterY2)

    if (dist < 67 || dist2 < 67) {
        return 0 // 0 for lost

    } else {
        return 1
    }

}


function startAnimation(num, distanceToMove, duration) {
    return backroundImage[num].animate(
        [ 
            { transform: `translateY(${distanceToMove})` }
        ],
        {
          duration: duration * 1000,
          easing: 'linear',
          fill: 'forwards',
        }
      );
}

function fadeDifficultyText() {
    const info = { duration: 1000, fill: "forwards" }

    difficultyText.animate([{ opacity: 1 }], info)

    setTimeout(() => {
        difficultyText.animate([{ opacity: 0 }], info)

    }, 1000)
}

function handleStartAndRestart() {
    water2[0].style.display = "block"
    water2[1].style.display = "block"
    click.play()

    const info = { duration: 1000, fill: "forwards" }

    easyLevelId = setTimeout(() => {
        fastLevel = 600
        difficultyText.textContent = "Easy Level"
        difficultyText.style.color = "rgb(56, 252, 56)"

        fadeDifficultyText()

    }, 10000)

    mediumLevelId = setTimeout(() => {
        fastLevel = 400
        difficultyText.textContent = "Medium Level"
        difficultyText.style.color = "orange"

        fadeDifficultyText()

    }, 20000)

    hardLevelId = setTimeout(() => {
        fastLevel = 200
        difficultyText.textContent = "Hard Level"
        difficultyText.style.color = "red"

        fadeDifficultyText()

    }, 30000)

    startEngine.play()
    startEngine.addEventListener("ended", () => {
        startEngine.currentTime = 2

        startEngine.play()

    })

    lostDiv.style.display = "none"

    settingsBtn.style.display = "none"
    invisableBtn.style.display = "none"

    exit.style.display = "block"

    backroundImage[0].animate([ { filter: "none" } ], info)
    backroundImage[1].animate([ { filter: "none" } ], info)
    car.animate([ { filter: "none" } ], info)

    water2[0].animate([ { filter: "none" } ], info)
    water2[1].animate([ { filter: "none" } ], info)

    lives.animate([ { opacity: 1 } ], info)

    startGameBtn.animate([ { opacity: "0" } ], info).onfinish = () => { startGameBtn.style.display = "none" }
    copyright.animate([ { opacity: "0" } ], info).onfinish = () => { copyright.style.display = "none" }
    title.animate([ { opacity: "0" } ], info)

    settings.style.display = "none"


    lives.textContent = livesCount
    isLost = false
}

water2[0].style.display = "none"
water2[1].style.display = "none"


startGameBtn.addEventListener("click", handleStartAndRestart)
restartBtn.addEventListener("click", () => {
    fastLevel = 800
    click.play()
    const info = { duration: 1000, fill: "forwards" }

    startGameBtn.style.display = "block"
    copyright.style.display = "block"

    settingsBtn.style.display = "block"
    invisableBtn.style.display = "block"

    lostDiv.animate([ { opacity: "0" } ], info)
    lostDiv.style.display = "none"

    startGameBtn.animate([ { opacity: "1" } ], info)
    copyright.animate([ { opacity: "1" } ], info)
    title.animate([ { opacity: "1" } ], info)

    
    lost.pause()
    lost.currentTime = 0

    water2[0].style.display = "none"
    water2[1].style.display = "none"


})

window.addEventListener('load', function() {
    function startAnimation(index, translateYValue, duration) {
        backroundImage[index].style.opacity = 1

        return backroundImage[index].animate(
            [{ transform: `translateY(${translateYValue})` }],
            {
                duration: duration * 1000,
                easing: 'linear',
                fill: 'forwards'
            }
        );
    }


    window.addEventListener("keydown", e => setKey(e.code));
    window.addEventListener("keyup", e => unsetKey(e.code));

    car.style.marginLeft = "0px"
    let marginLeftVal = parseInt(car.style.marginLeft.replace("px", ""))
    const carSpeed = 5

    let isCollide = false
    
    const update = () => {
        if ((isKeyPressed("KeyA") || isKeyPressed("left")) && marginLeftVal >= -190) {
            marginLeftVal -= carSpeed
            woosh.play()

        } else if ((isKeyPressed("KeyD") || isKeyPressed("right")) && marginLeftVal <= 190) {
            marginLeftVal += carSpeed
            woosh.play()

        }

        car.style.marginLeft = marginLeftVal + "px"

        let isLostCode = checkLose()

        if (isLostCode == 0 && !isCollide) {
            splash.play()
            lives.textContent = parseInt(lives.textContent) - 1
            isCollide = true

        } else if (isLostCode == 1) {
            isCollide = false

        }

        if (parseInt(lives.textContent) == 0) {
            lost.play()
            startEngine.pause()
            startEngine.currentTime = 0
            
            this.clearTimeout(easyLevelId)
            this.clearTimeout(mediumLevelId)
            this.clearTimeout(hardLevelId)

            isLost = true
            exit.style.display = "none"
            lives.textContent = livesCount
            const info = { duration: 1000, easing: 'linear', fill: 'forwards' }

            backroundImage[0].animate( [{ filter: "blur(4px)" }], info )
            backroundImage[1].animate( [{ filter: "blur(4px)" }], info )
            car.animate( [{ filter: "blur(4px)" }], info )

            water2[0].animate( [{ filter: "blur(4px)" }], info )
            water2[1].animate( [{ filter: "blur(4px)" }], info )

            lives.animate([ { opacity: 0 } ], info)

            lostDiv.style.display = "block"
            lostDiv.animate([ { opacity: 1 } ], info)
            
        }
        
        this.setTimeout(update, 0)
    }

    function waterAnimation(water, translateYValue, duration) {
        return water.animate([
            { transform: `translateY(${translateYValue})` }

        ], {
            duration: duration * 1000,
            easing: 'linear',
            fill: 'forwards'

        })
    }

    function loop(first, second) {        
        startAnimation(second, "-71%", 0)

        startAnimation(first, "71%", 2).onfinish = () => {
            backroundImage[first].style.opacity = 0
        
        }

        startAnimation(second, "29%", 4.4)
        .onfinish = () => { loop(second, first) }


        waterAnimation(water2[0], "1200%", 3.2)
        .onfinish = () => {
            waterAnimation(water2[0], "-630%", 0)
            water2[0].style.marginLeft = waterPosition()

        }

        setTimeout(() => {
            waterAnimation(water2[1], "1200%", 3.2)
            .onfinish = () => {
                waterAnimation(water2[1], "-630%", 0)
                water2[1].style.marginLeft = waterPosition()

            }

        }, fastLevel)

    }

    loop(1, 0)
    update()

})

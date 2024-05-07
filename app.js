const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");

const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");

//initially vairables need????

let oldTab = userTab;
const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";
oldTab.classList.add("current-tab");
getfromSessionStorage();

function switchTab(newTab) {
    if (newTab != oldTab) {
        oldTab.classList.remove("current-tab");
        oldTab = newTab;
        oldTab.classList.add("current-tab");

        if (!searchForm.classList.contains("active")) {
            //kya search form wala container is invisible, if yes then make it visible
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else {
            //main pehle search wale tab pr tha, ab your weather tab visible karna h 
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            //ab main your weather tab me aagya hu, toh weather bhi display karna poadega, so let's check local storage first
            //for coordinates, if we haved saved them there.
            getfromSessionStorage();
        }
    }
}

userTab.addEventListener("click", () => {
    //pass clicked tab as input paramter
    switchTab(userTab);
});

searchTab.addEventListener("click", () => {
    //pass clicked tab as input paramter
    switchTab(searchTab);
});

function getfromSessionStorage() {
    let corrd = sessionStorage.getItem("user-cord")
    if (!corrd) {
        grantAccessContainer.classList.add("active")
    }
    else {
        console.log(corrd)
        const corrdinat = JSON.parse(corrd)
        console.log(corrdinat)
        fetchUserweather(corrdinat)
    }

}


function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition)
    }
    else {
        alert("Please give access of location")
    }
}
function showPosition(position) {
    const corrd = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }

    sessionStorage.setItem("user-cord",JSON.stringify(corrd))
    fetchUserweather(corrd)
}



function renderWeatherData(data)
{

    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");
    console.log(data)
    cityName.innerText=data?.name
    countryIcon.src=`https://flagsapi.com/${data?.sys?.country}/flat/64.png`
    desc.innerText=data?.weather?.[0]?.description
    weatherIcon.src= `http://openweathermap.org/img/w/${data?.weather?.[0]?.icon}.png`;
    temp.innerText=data?.main?.temp +" °C"
    windspeed.innerText=data?.wind?.speed + " m/s"
    humidity.innerText=data?.main?.humidity + " %"
    cloudiness.innerText=data?.clouds?.all


}
async function fetchUserweather(corrdinates) {
    const {lat,lon}=corrdinates
    console.log(corrdinates)
    errBlock.classList.remove("active")
    grantAccessContainer.classList.remove("active")
    loadingScreen.classList.add("active")
    console.log(lat)
    console.log(lon)
    try {
         const responce=await fetch( `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`)
         let userData=await responce.json()
         renderWeatherData(userData)
         console.log(userData)
         loadingScreen.classList.remove("active")
         userInfoContainer.classList.add("active")
    } catch (e) {
          alert(e)
          console.log(e)
    }
}
const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click", getLocation);

const searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let cityName = searchInput.value;

    if(cityName === "")
        return;
    else 
        fetchSearchWeatherInfo(cityName);
})

let errBlock = document.querySelector(".error")
async function fetchSearchWeatherInfo(city) {
    errBlock.classList.remove("active")
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");
    console.log(city)

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=d8eaea47bad2c14c850ff1cb7c2a3349&units=metric`
          );
        const data = await response.json();
        loadingScreen.classList.remove("active");
        if(data.cod==200)
            {
                userInfoContainer.classList.add("active");
                errBlock.classList.remove("active")

            }
            else{
              
                errBlock.classList.add("active")
            }
        
        renderWeatherData(data);
        console.log(city)
    }
    catch(err) {
       alert("err")
       console.log(err)
    }
}
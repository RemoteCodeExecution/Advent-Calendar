
const discoverAllBtn = document.querySelector(".btn-reset");
const calendarContainer = document.querySelector(".container");
const titre = document.querySelector(".titre");
const buttonCover = document.querySelector(".btn-cover");
const joursRestants = document.querySelector(".message");
const muteAudio = document.querySelector(".btn-mute");
const containerSnowflakes = document.querySelector(".snowflakes");

const calendarDays = 24;
let arrayColor = ["#CC231Ece", "#0F8A5Fce", "#FBB229ce"]; // Tableau contenant nos couleurs
let haveIt = [];

var DateTime = luxon.DateTime;
const today = DateTime.local().day; // Utiliser DateTime.local().day pour la date réel, remplacer par un integer pour test.
let joursUntil = 25 - today; // ! R


// * Vérifie la date et grise les cases des jours déjà passé
const checkDate = (text, date) => {
  if ((date + 1) < today) { // ! 
    text.style.filter = "grayscale(100%)";
    joursRestants.innerHTML = `${joursUntil} Jours avant Noël`;
    
  }
}

// * Objets contenant nos audios
var audioMain = new Audio("sounds/jinglebells.mp3"); // Un objet (Jingle Bells Violin by ZakharValaha from Pixabay)
audioMain.volume = 0.015; // Controle notre volume
var audioChristmasDay = new Audio("sounds/christmasday.mp3"); // Un objet (Christmas Day by Alex_MakeMusic from Pixabay)
audioChristmasDay.volume = 0.01; // Controle notre volume

// * Créer nos div utilisé pour afficher nos flocons qui tombe sur la page
const spawnSnowflakes = () => {
  for (i = 0; i < 13; i++) {
    const createDiv = document.createElement("div");
    createDiv.classList.add("snowflake");
    containerSnowflakes.appendChild(createDiv);
    createDiv.innerHTML = "❅";
  }
};

// * Fonction utilisé pour gérer nos audios
const playAudio = () => {
  if (joursUntil <= 23 && joursUntil > 0) { // ! 
    if (audioMain.paused) {
      // Si l'audio principal est en pause, c'est qu'il n'est pas encore lancé
      audioMain.play();
      audioMain.currentTime = 0; // Reset le timer de l'audio
      audioMain.loop = true; // Loop l'audio

      if (!audioChristmasDay.paused) {
        // Si l'audio du jour de noel n'est pas en pause, c'est qu'il est lancé
        audioChristmasDay.pause(); // On le met en pause pour éviter d'avoir deux audi simultanément
        audioChristmasDay.currentTime = 0; // On le reset à 0 pour le réutiliser plus tard
      }
    }
  } else if (joursUntil == 0) {
    audioMain.pause();
    audioChristmasDay.play();
    audioChristmasDay.loop = true;

    if (buttonCover.style.display == "block") {
      audioChristmasDay.volume = 0.04;
    }
  }
};

// * Fonction nous permettant de rendre l'audio muet ou non
const mute = () => {
  if (audioChristmasDay.muted || audioMain.muted) {
    audioChristmasDay.muted = false;
    audioMain.muted = false;
    muteAudio.style.backgroundColor = "#0F8A5F";
  } else {
    audioChristmasDay.muted = true;
    audioMain.muted = true;
    muteAudio.style.backgroundColor = "#bb2528ce";
  }
};

// * Fonction utilisé pour afficher joyeux noel le jour de noel
const christmasDay = (jours) => {
  if (jours <= 0) {
    joursRestants.innerHTML = `Joyeux Noël !!`;
    discoverAllBtn.style.display = "none"; // * On cache le bouton 'Discover All'
    buttonCover.style.display = "block"; // * On affiche le bouton 'Cover All'
  }
};

// * Fonction utilisé pour ouvrir une seule fenêtre en cliquant sur la fenêtre en question
const openDoor = (path, event) => {
  if (event.target.style.opacity == 0) {
    // Do nothing
  } else if (event.target.style.opacity != 0) {
    // * Target le node parent cliqué
    event.target.parentNode.style.backgroundImage = `url(${path})`;
    event.target.style.opacity = "0"; // Réduit l'opacité à 0
    event.target.style.cursor = "default";

    if (event.target.style.filter == 0) { // Vérifie si le filtre (grayscale) est présent ou non, si non on décrémente les jours restants
    --joursUntil;
    }
    joursRestants.innerHTML = `${joursUntil} Jours avant Noël`;
    christmasDay(joursUntil);
    playAudio();
  }
};

// * Fonction utilisé pour ouvrir toutes les portes en cliquant sur 'Discover All'
const discoverAll = (text, img, path) => {
  joursUntil = 0;
  christmasDay(joursUntil);
  playAudio();
  text.style.opacity = "0";
  text.style.cursor = "default";
  img.style.backgroundImage = `url(${path})`; // * Le chemin d'accès de nos images
  discoverAllBtn.style.display = "none"; // * On cache le bouton 'Discover All'
  buttonCover.style.display = "block"; // * On affiche le bouton 'Cover All'
};

// * Fonction utilisé pour fermer toutes les portes après les avoirs révélé
const coverAll = (text, img) => {
  joursUntil = 25 - today; // ! 
  joursRestants.innerHTML = `${joursUntil} Jours avant Noël`;
  text.style.opacity = "1";
  text.style.cursor = "pointer";
  img.style.backgroundImage = "none";
  buttonCover.style.display = "none";
  discoverAllBtn.style.display = "block";
  playAudio();
  christmasDay();
  // img.style.gridArea = "door" + generateUniqueRandom(24); // ! La première case ce retrouve mal placé.
  // calendarContainer.appendChild(img);
};

// * Fonction générant un nombre unique entre 1 et le nombre recu, puis répète jusau'a remplir le tableau 'HaveIt'
function generateUniqueRandom(maxNr) {
  let random = (Math.floor(Math.random() * maxNr) + 1).toFixed(); // Génère un nombre aléatoire
  //Coerce to number by boxing
  random = Number(random);

  if (!haveIt.includes(random)) {
    // Si 'HaveIt'n'inclut PAS le nombre random généré...

    haveIt.push(random); // On push le random dans l'array

    return random;
  } else {
    if (haveIt.length < maxNr) {
      // Sinon, si la taille de 'HaveIt'est strictement inférieur à la valeur maxNr fournis...

      return generateUniqueRandom(maxNr); // On retourn la fonction et la valeur de départ pour continuer de remplir notre array
    } else {
      haveIt = [];
      console.log("No more numbers available."); // Sinon, c'est que le tableau est plein
    }
  }
}

// * Fonction utilisé pour shuffle notre tableau afin d'en tirer des couleurs aléatoires parmis celles contenu dans notre tableau
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    // i = taille de notre array minus 1, tant que i est suspérieur a 0, décrémentons i
    const j = Math.floor(Math.random() * (i + 1)); // Génére un nombre aléatoire
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
};

// * Fonction utilisé pour appliquer nos couleurs a nos fenetres
function randColors() {
  const textElement = document.querySelectorAll(".text");

  for (let i = 0; i <= 23; i++) {
    for (let j = 0; j < 8; j++) {
      textElement[j].style.backgroundColor = arrayColor[0];
      textElement[j].style.opacity = 1;
    }

    for (let k = 8; k < 16; k++) {
      textElement[k].style.backgroundColor = arrayColor[1];
      textElement[k].style.opacity = 1;
    }

    for (let l = 16; l < 24; l++) {
      textElement[l].style.backgroundColor = arrayColor[2];
      textElement[l].style.opacity = 1;
    }
  }
}

// * Fonction qui créer la structure de notre page
const createCalendar = () => {
  for (let i = 0; i < calendarDays; i++) {
    const calendarDoor = document.createElement("div");
    const calendarDoorText = document.createElement("div");

    // Ajoute une classe 'image' à notre div
    calendarDoor.classList.add("image");

    calendarDoor.style.gridArea = "door" + generateUniqueRandom(24);



    // Ajoute la fenêtre dans le container
    calendarContainer.appendChild(calendarDoor);

    // Ajoute une classe text à notre div
    calendarDoorText.classList.add("text");

    // Écrit nos numéros sur chaque cases
    calendarDoorText.innerHTML = i + 1;

    checkDate(calendarDoorText, i, joursUntil);

    calendarDoor.appendChild(calendarDoorText);

    /*
      Utilisé pour récupérer nos images
      Nous faisons i + 1 car notre première images n'est pas nommé images0
      Ensuite nous créons une variable contenant le chemin de nos images
     */
    courseNumber = i + 1;
    let coursePath = `./img/image${courseNumber}.jpg`;

    calendarDoorText.addEventListener("click", openDoor.bind(null, coursePath)); // Event Listener sur nos cases du calendrier
    discoverAllBtn.addEventListener(
      "click",
      discoverAll.bind(null, calendarDoorText, calendarDoor, coursePath)
    ); // Event Listener sur notre bouton 'Discover All'
    buttonCover.addEventListener(
      "click",
      coverAll.bind(null, calendarDoorText, calendarDoor)
    ); // Event Listener sur notre bouton 'Cover All'
    muteAudio.addEventListener("click", mute);
  }
};

// * Function main
function main() {
  shuffleArray(arrayColor);
  spawnSnowflakes();
  createCalendar();
  randColors();
  playAudio();
  christmasDay()
  // checkDate()
}

main();

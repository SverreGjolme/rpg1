// Spillerens stats
let xp = 0;
let health = 100;
let gold = 50;
let currentWeapon = 0;

// Variabler for kamp
let fighting;
let monsterHealth;
let inventory = ["stick"];

// Henter HTML-elementer
const button1 = document.querySelector("#button1");
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");

const text = document.querySelector("#text");
const xpText = document.querySelector("#xpText");
const healthText = document.querySelector("#healthText");
const goldText = document.querySelector("#goldText");
const monsterStats = document.querySelector("#monsterStats");
const monsterName = document.querySelector("#monsterName");
const monsterHealthText = document.querySelector("#monsterHealth");


// Liste over våpen og monstre
const weapons = [
    {
        name: "stick",
        power: 5
    },
    {
        name: "dagger",
        power: 30
    },
    {
        name: "claw hammer",
        power: 50
    },
    {
        name: "sword",
        power: 100
    }
];

const monsters = [
    {
        name: "slime",
        level: 2,
        health: 15
    },
    {
        name: "fanged beast",
        level: 8,
        health: 60
    },
    {
        name: "dragon",
        level: 20,
        health: 300
    }
];


// Liste over steder og hendelser
const locations = [
    {
        name: "town square",
        "button text": ["Go to store", "Go to cave", "Fight dragon"],
        "button functions": [goStore, goCave, fightDragon],
        text: "You are in the town square. You see a sign that says \"Store\"."
    },
    {
        name: "store",
        "button text": ["Buy 10 health (10 gold)", "Buy weapon (30 gold)", "Go to town square"],
        "button functions": [buyHealth, buyWeapon, goTown],
        text: "You enter the store."
    },
    {
        name: "cave",
        "button text": ["Fight slime", "Fight fanged beast", "Go to town square"],
        "button functions": [fightSlime, fightBeast, goTown],
        text: "You enter the cave. You see some monsters."
    },
    {
        name: "fight",
        "button text": ["Attack", "Dodge", "Run"],
        "button functions": [attack, dodge, goTown],
        text: "You are fighting a monster."
    },
    {
        name: "kill monster",
        "button text": ["Go to town square", "Go to town square", "Go to town square"],
        "button functions": [goTown, goTown, easterEgg],
        text: 'The monster screams "Arg!" as it dies. You gain experience points and find gold.'
    },
    {
        name: "lose",
        "button text": ["REPLAY?", "REPLAY?", "REPLAY?"],
        "button functions": [restart, restart, restart],
        text: "You die. ☠️"
    },
    {
        name: "win",
        "button text": ["REPLAY?", "REPLAY?", "REPLAY?"],
        "button functions": [restart, restart, restart],
        text: "You defeat the dragon! YOU WIN THE GAME! 🎉"
    },
    {
        name: "easter egg",
        "button text": ["2", "8", "Go to town square?"],
        "button functions": [pickTwo, pickEight, goTown],
        text: "You find a secret game. Pick a number above. Ten numbers will be randomly chosen between 0 and 10. If the number you choose matches one of the random numbers, you win!"
    }

];

// Hendelse når knappene initialiseres
button1.onclick = goStore;
button2.onclick = goCave;
button3.onclick = fightDragon;


// Funksjon for å oppdatere spilltilstanden
function update(location){
    monsterStats.style.display = "none";

    button1.innerText = location["button text"][0];
    button2.innerText = location["button text"][1];
    button3.innerText = location["button text"][2];

    button1.onclick = location["button functions"][0];
    button2.onclick = location["button functions"][1];
    button3.onclick = location["button functions"][2];

    text.innerText = location.text;
}


// Funksjoner for å navigere til ulike steder
function goTown(){
    update(locations[0]);
}

function goStore(){
    update(locations[1]);
}

function goCave(){
    update(locations[2]);
}


// Funksjoner for butikkhandlinger
function buyHealth(){
    if(gold >= 10){
        gold -= 10;
        health += 10;
        goldText.innerText = gold;
        healthText.innerText = health;
    }
    else{
        text.innerText = "You do not have enough gold to buy health."
    }
}

function buyWeapon(){
    if(currentWeapon < weapons.length - 1){
        if(gold >= 30){
            gold -= 30;
            currentWeapon ++;
            goldText.innerText = gold;
            let newWeapon = weapons[currentWeapon].name;
            text.innerText = "You now have a " + newWeapon + ".";
            inventory.push(newWeapon);
            text.innerText += " In your inventory you have: " + inventory;
        }
        else{
            text.innerText = "You do not have enough gold to buy a weapon.";
        }
    }
    else{
        text.innerText = "You already have the most powerful weapon!";
        button2.innerText = "Sell weapon for 15 gold";
        button2.onclick = sellWeapon;
    }
}

function sellWeapon(){
    if(inventory.length > 1){
        gold += 15;
        goldText.innerText = gold;
        let currentWeapon = inventory.shift();
        text.innerText = "You sold a " + currentWeapon + ".";
        text.innerText += " In your inventory you have: " + inventory;
    }
    else{
        text.innerText = "Don't sell your only weapon!";
    }
}


// Funksjoner for å starte kamper med ulike monstre
function fightSlime(){
    fighting = 0;
    goFight();
}

function fightBeast(){
    fighting = 1;
    goFight();
}

function fightDragon(){
    fighting = 2;
    goFight();
}

// Funksjon for å starte kampen
function goFight(){
    update(locations[3]);                               // Oppdaterer grensesnittet for kamp
    monsterHealth = monsters[fighting].health;          // Henter monsterets helse
    monsterStats.style.display = "block";               // Gjør monsterets statistikkområde synlig
    monsterName.innerText = monsters[fighting].name;    // Setter monsterets navn
    monsterHealthText.innerText = monsterHealth;        // Viser monsterets helse
}

// Funksjon for å utføre angrep under kamp
function attack(){
    text.innerText = "The " + monsters[fighting].name + " attacks.";                   // Viser monsterets angrep
    text.innerText += " You attack it with your " + weapons[currentWeapon].name + "."; // Viser spillerens angrep med gjeldende våpen
    health -= getMonsterAttackValue(monsters[fighting].level);                         // Reduserer spillerens helse basert på monsterets angrepsverdi

    if(isMonsterHit()){                                                                     // Sjekker om spilleren treffer monsteret
        monsterHealth -= weapons[currentWeapon].power + Math.floor(Math.random() * xp) + 1; // Reduserer monsterets helse ved vellykket treff
    }
    else{
        text.innerText += " You miss."; // Melding om at spilleren bommet
    }

    healthText.innerText = health;               // Oppdaterer visningen for spillerens helse
    monsterHealthText.innerText = monsterHealth; // Oppdaterer visningen for monsterets helse

    if(health <= 0){
        lose();         // Hvis spilleren dør
    }
    else if(monsterHealth <= 0){
        fighting === 2 ? winGame() : defeatMonster(); // Kaller seiersfunksjonen eller monsteret-feiet-funksjonen avhengig av hvilket monster som ble beseiret
    }

    // Sjekker om våpenet ødelegges tilfeldig med en 10% sjanse, med unntak av hvis det er det eneste våpenet i inventory
    if(Math.random() <= .1 && inventory.length !== 1){
        text.innerText += " Your " + inventory.pop() + " breaks."; // Melding om at våpenet er ødelagt
        currentWeapon--;
    }
}

// Funksjon for å beregne verdien av monsterets angrep basert på nivå
function getMonsterAttackValue(level){
    const hit = (level * 5) - (Math.floor(Math.random() * xp)); // Beregner monsterets angrepsverdi
    return hit > 0 ? hit : 0;                                   // Sørger for at angrepsverdien ikke er negativ
}

// Funksjon for å unngå monsterets angrep
function dodge(){
    text.innerText = "You dodge the attack from the " + monsters[fighting].name; // Melding om vellykket dodge
}

// Funksjon for å håndtere seier over et monster
function defeatMonster(){
    gold += Math.floor(monsters[fighting].level * 6.7);  // Legger til gold basert på monsterets nivå
    xp += monsters[fighting].level;                      // Legger til xp basert på monsterets nivå
    goldText.innerText = gold;                           // Oppdaterer visningen for gold
    xpText.innerText = xp;                               // Oppdaterer visningen for xp
    update(locations[4]);                                // Oppdaterer grensesnittet for hendelse etter å ha beseiret et monster
}

// Funksjon for å sjekke om spilleren treffer monsteret
function isMonsterHit(){
    return Math.random() > .2 || health < 20; // 20% sjanse for å bomme
}

// Funksjon for å håndtere tap i spillet
function lose(){
    update(locations[5]); // Oppdaterer grensesnittet for hendelse ved tap
}

// Funksjon for å håndtere seier i spillet
function winGame(){
    update(locations[6]); // Oppdaterer grensesnittet for hendelse ved seier
}

// Funksjon for å starte spillet på nytt
function restart(){
    // ... (kode for å tilbakestille spillerens stats og gå til byen)
}

// Funksjon for å håndtere påskeegg hendelse
function easterEgg(){
    update(locations[7]); // Oppdaterer grensesnittet for påskeegg hendelse
}

// Funksjon for å håndtere valg av tall i påskeegg hendelse
function pick(guess){
    // ... (kode for å håndtere valg og vise resultat)
}

// Hjelpefunksjoner for spesifikke tallvalg i påskeegg hendelse
function pickTwo(guess){
    pick(2);
}

function pickEight(guess){
    pick(8);
}

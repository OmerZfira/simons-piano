'use strict';

//TODO: // make keyboard presses available
        // make sequence to objects with timediff and the player needs to click not only order but also with corerct time diff
        // make notes apear from inside the screen like guitar hero
        // make several notes to press together (chords)

// Global selectors
var TURN_SELECTOR = 'current-turn',
    SCORE_SELECTOR = 'score';

// Global game objects
var gMapNotesById,
    gState;

///////// *** Loads Model, Piano(DOM) and shows menu if needed.
function initGame(isFirstLoad) {
    gMapNotesById = createNotes(4);
    renderNotes(gMapNotesById);
    if (isFirstLoad) {
        document.querySelector('.menu_container').classList.toggle('shownMenu');
    } else {
        playGame();
    }
} // *** End of loadGame

///////// *** Create the notes Model
function createNotes(size) {
    var notes = {};

    for (var i = 1; i <= size; i++) {
        var audioFileName = 'sound/Note' + i + '.mp3';
        notes[i] = { sound: new Audio(audioFileName)};
    }
    return notes;
} // *** End of renderNotes

///////// *** Render notes into DOM with html tags
function renderNotes(notes) {
    var elPiano = document.querySelector('.piano');
    var strHtml = ''; 
    for (var key in notes) {
        if (notes.hasOwnProperty(key)) {
            strHtml += '<div class="note note' + key + '" onclick="noteClicked(this, ' + key + ')"></div>'; 
        }
    }
    elPiano.innerHTML = strHtml;
} // *** End of renderNotes

///////// *** Initiate a new game - is called at load-game
function playGame() {
    
    // Reset globals and init
    setTimeout(function () {
        gState = {
            isUserTurn: false,
            turnNum: 0,
            seqNoteIndexes: [],
            currNoteIndexToClick: 0,
            prevNote: null,
            tempo: 600
        }
        document.querySelector('.menu_container').classList.toggle('shownMenu');

        setTimeout(doComputerMove, 200);
    }, 400);
} // *** End of playGame

///////// *** Send msg to player
function tellUser(msg, selector) {
    var elUserMsg = document.querySelector('.' + selector);
    elUserMsg.innerHTML = msg;
} // *** End of tellUser


   

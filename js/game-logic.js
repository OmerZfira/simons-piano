'use strict';

///////// *** Do the computer's move
function doComputerMove() {
    addRandomNote();
    playSeq();
} // *** End of doComputerMove

///////// *** Adds another note to the notes sequence
function addRandomNote() {
    var randNoteIndex = getRandomInt(1, Object.keys(gMapNotesById).length);
    // Make sure not same note 3 times in a row
    if (gState.seqNoteIndexes.length > 1) {
        while ( randNoteIndex === gState.seqNoteIndexes[gState.seqNoteIndexes.length - 1] &&
                randNoteIndex === gState.seqNoteIndexes[gState.seqNoteIndexes.length - 2]) {

            randNoteIndex = getRandomInt(1, Object.keys(gMapNotesById).length);
        }
    }
    gState.seqNoteIndexes.push(randNoteIndex);
} // *** End of addRandomNote

///////// *** Plays the notes sequence of the computer
function playSeq() {

    var elPiano = document.querySelector('.piano');

    gState.seqNoteIndexes.forEach(function (seqNoteIndex, i) {

        //TODO: add random timediff between notes
        // var randtimeDiff = getRandomInt(3, 6);
        // console.log('randtimeDiff*i', randtimeDiff*i);

        // Play the seq with fixed time difference between notes
        var elCurrNote = elPiano.querySelector('.note' + seqNoteIndex);
        setTimeout(function () {
            console.log('gState.tempo', gState.tempo);
            playNote(elCurrNote, seqNoteIndex);
            // When done playing the seq - change turns
            if (i === gState.seqNoteIndexes.length - 1) {
                setTimeout(function () {
                    gState.prevNote.element.classList.remove('playing');
                    gState.isUserTurn = true;

                }, gState.tempo);
            }
        }, gState.tempo * i);
    });
} // *** End of playSeq

///////// *** Plays a note
function playNote(elNote, noteIndex) {
    // Reset Model and DOM of the previous note played
    if (gState.prevNote) {
        gState.prevNote.sound.pause();
        gState.prevNote.sound.currentTime = 0;
        gState.prevNote.element.classList.remove('playing');
    }

    // Play the note and update Model and DOM
    gMapNotesById[noteIndex].sound.play();
    gState.prevNote = { sound: gMapNotesById[noteIndex].sound, element: elNote };
    elNote.classList.add('playing');
} // *** End of playNote

///////// *** Take actions after player clicks a note
function noteClicked(elNote, noteIndex) {

    if (!gState.isUserTurn) return;
    playNote(elNote, noteIndex);
    
    // Make sure the "playing" class removed from the last note played correctly
    setTimeout(function () {
        if (gMapNotesById[noteIndex].sound === gState.prevNote.sound) {
            elNote.classList.remove('playing');
        }
    }, 1000);

    // Player clicked the right note?
    if (noteIndex === gState.seqNoteIndexes[gState.currNoteIndexToClick]) {
        gState.currNoteIndexToClick++;
        // Player finished current turn?
        if (gState.currNoteIndexToClick === gState.seqNoteIndexes.length) {
            gState.isUserTurn = false;
            gState.turnNum++;
            gState.currNoteIndexToClick = 0;
            prepNextTurn();
        }

    } else { // Player was wrong?
        gState.isUserTurn = false;
        var elMenu = document.querySelector('.menu_container');
        
        // Write correct text on "new game" button
        if (gState && elMenu.querySelector('.play-btn').innerText !== 'Play Again') {
            elMenu.querySelector('.play-btn').innerText = 'Play Again';
        }

        elMenu.classList.toggle('shownMenu');
        tellUser('Great Job!<br>You Scored: ' + gState.turnNum, SCORE_SELECTOR);
    }
} // *** End of noteClicked

///////// *** Prepare game and player for next turn
function prepNextTurn() {
    var delay = 2000;
    var msgString = 'Score: ' + gState.turnNum;
    var animationSelector = 'shown';
    gState.tempo = 600;

    // Make it harder and change message to the player
    if (gState.turnNum % 4 === 0 || (gState.turnNum % 5 === 0 && Object.keys(gMapNotesById).length < 7)) {
        delay = 4000;
        animationSelector = 'shownLonger';

        // Shuffle notes every 3 levels
        if (gState.turnNum % 4 === 0) {
            setTimeout(shuffleNotes, 1200);
            msgString += '<br><br>Well Done! Now let\'s shuffle things up..';

        // Add a note every 5 levels
        } else if (gState.turnNum % 5 === 0 && Object.keys(gMapNotesById).length < 7) {
            msgString = 'Score: ' + gState.turnNum + '<br><br>Super! Now let\'s make things a little harder..';
            setTimeout(addNote, 1200);

        }
        // TODO : MAKE COMPUTER FASTER   
        // if (Object.keys(gMapNotesById).length === 4){
        //     gState.tempo = 300;
        // }
    }
    
    // Announce next turn to user
    trianglesAnimation();
    document.querySelector('.score-canvas').classList.add('shown-canvas');
    tellUser(msgString, TURN_SELECTOR)
    document.querySelector('.current-turn_container').classList.add(animationSelector);

    // Reset DOM and start next computer move
    setTimeout(function () {
        doComputerMove();
        document.querySelector('.current-turn_container').classList.remove(animationSelector);
        document.querySelector('.score-canvas').classList.remove('shown-canvas');
    }, delay);
} // *** End of prepNextTurn

///////// *** Shuffle the notes in DOM
function shuffleNotes() {
    var elPiano = document.querySelector('.piano');

    for (var i = elPiano.children.length; i >= 0; i--) {
        var randIndex = Math.random() * i | 0;
        elPiano.appendChild(elPiano.children[randIndex]);
    }
} // *** End of shuffleNotes

///////// *** Adds a note in Model and DOM
function addNote() {
    var newNoteId = Object.keys(gMapNotesById).length + 1;
    var audioFileName = 'sound/Note' + newNoteId + '.mp3';
    gMapNotesById[newNoteId] = { sound: new Audio(audioFileName)};
    
    var elPiano = document.querySelector('.piano');
    var elNewNote = document.createElement('div');
    elNewNote.innerHTML = '<div class="note note' + newNoteId + '" onclick="noteClicked(this, ' + newNoteId + ')"></div>'; 

    elPiano.appendChild(elNewNote.firstChild);
} // *** End of addNote
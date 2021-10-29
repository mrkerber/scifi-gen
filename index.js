import * as dataFunctions from './dataFunctions.js';
import * as twitterFunctions from './twitterFunctions.js';
import * as unsplashFunctions from './unsplashFunctions.js';
import fs from 'fs'
import 'colors';

let runCount = 1;

/***** PARSE COMMAND LINE ARGUMENTS *****/
for (let i=2; i<process.argv.length; i++){
    if (process.argv[i].match(/^[0-9]+$/))
        runCount = process.argv[i];
}

let choicePath = await dataFunctions.choosePath();

const buildPhrase = async () => {
    let segments = new Array;
    let logicFailure = '';
    let iteration = 1;
    let phraseIsLogical = false;
    let phrase = '';

    /***** POPULATE SEGMENT ARRAY BASED ON CHOICE PATH *****/
    for(let i = 0; i < 3; i++)
        segments[i] = await findNewSegment(i);

    /***** LOOP THROUGH PHRASE LOGIC UNTIL SUCCESSFUL PHRASE IS CREATED*****/
    phrase = segments[choicePath.indexOf('descriptor')]['segment'] + ' '
    + segments[choicePath.indexOf('subject')]['segment'] + ' '
    + segments[choicePath.indexOf('action')]['segment'];
    console.log('BEGIN: 1) ' + segments[0]['segment'] + ' 2) ' + segments[1]['segment'] + ' 3) ' + segments[2]['segment']);

    while (!phraseIsLogical) {
        phrase = segments[choicePath.indexOf('descriptor')]['segment'] + ' '
        + segments[choicePath.indexOf('subject')]['segment'] + ' '
        + segments[choicePath.indexOf('action')]['segment'];
        if (logicFailure == 1)
            console.log('\nUPDATE: 1) ' + segments[0]['segment'] + (' 2) ' + segments[1]['segment']).yellow.bold + ' 3) ' + segments[2]['segment']);
        else if (logicFailure == 2)
            console.log('\nUPDATE: 1) ' + segments[0]['segment'] + ' 2) ' + segments[1]['segment'] + (' 3) ' + segments[2]['segment']).yellow.bold);
        logicFailure = await determinePhraseLogic(segments);
        if (logicFailure > 0) {
            segments[logicFailure] = await findNewSegment(logicFailure);
            iteration++;
        }
        else
            phraseIsLogical = true;
    }

    let isScifiRelated = await checkScifiRelated(segments);
    saveOutput(phrase, isScifiRelated);
    if (!isScifiRelated) {
        console.log(('REROLLING: Not Scifi-Related: "' + phrase + '"\n').yellow.bold);
        buildPhrase();
    } else {
        console.log('\nEND: '+ (phrase).green.bold + ' - Iterations: ' + iteration);
        console.log('Posting to Twitter: ' + (phrase));
        twitterFunctions.postTweet(phrase);
        console.log(await unsplashFunctions.fetchPicture(phrase));
        console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
    }
}

const findNewSegment = async (index) => {
    let segment = '';

    switch (choicePath[index]) {
        case 'descriptor':
            segment = await dataFunctions.findDescriptor();
            break;
        case 'subject':
            segment = await dataFunctions.findSubject();
            break;
        case 'action':
            segment = await dataFunctions.findAction();
            break;
        default:
            console.log('Invalid segment identifier');
    }
    return segment;
}

const determinePhraseLogic = async (segments) => {
    let logicFailure = 0;
    let compatibilityString;

    /***** CHECK SEGMENT ONE AGAINST SEGMENT TWO *****/
    compatibilityString = await compareSegmentAttributes(segments[0], segments[1])

    if(compatibilityString === '') {
        console.log(('ERROR: Incompatible(1-2): "' + segments[0].segment + '" WITH "' + segments[1].segment + '"').red.bold);
        logicFailure = 1;
        return logicFailure;
    } else {
        console.log('Compatible(1-2): ' + compatibilityString)
    }

    /***** CHECK SEGMENT ONE AGAINST SEGMENT THREE *****/
    compatibilityString = await compareSegmentAttributes(segments[0], segments[2])

    if(compatibilityString === '') {
        console.log(('ERROR: Incompatible(1-3): "' + segments[0].segment + '" WITH "' + segments[2].segment + '"').red.bold);
        logicFailure = 2;
        return logicFailure;
    } else {
        console.log('Compatible(1-3): ' + compatibilityString)
    }

    /***** CHECK SEGMENT TWO AGAINST SEGMENT THREE *****/
    compatibilityString = await compareSegmentAttributes(segments[1], segments[2])

    if(compatibilityString === '') {
        console.log(('ERROR: Incompatible(2-3): "' + segments[1].segment + '" WITH "' + segments[2].segment + '"').red.bold);
        logicFailure = 2;
        return logicFailure;
    } else {
        console.log('Compatible(2-3): ' + compatibilityString)
    }

    return logicFailure;
}

const compareSegmentAttributes = async (segmentA, segmentB) => {
    let compatiblityString = '';

    if (segmentA['anthropomorphic'] == 'Y' && segmentB['anthropomorphic'] == 'Y') {
        compatiblityString += 'anthropomorphic ';
    } if (segmentA['emotionable'] == 'Y' && segmentB['emotionable'] == 'Y') {
        compatiblityString += 'emotionable ';
    } if (segmentA['technical'] == 'Y' && segmentB['technical'] == 'Y') {
        compatiblityString += 'technical ';
    } if (segmentA['locational'] == 'Y' && segmentB['locational'] == 'Y') {
        compatiblityString += 'locational '
    }

    return compatiblityString;
}

const checkScifiRelated = async (segments) => {
    if (segments[0]['scifi-related'] == 'N' && segments[1]['scifi-related'] == 'N' && segments[2]['scifi-related'] == 'N')
        return false;
    else
        return true;
}

const saveOutput = async (phrase, isScifiRelated) => {
    if (isScifiRelated) {
        fs.appendFileSync('./data/generatedPhrases.txt', phrase + '\n', err => {
            if (err) {
                console.error(err.red.bold);
                return;
            }
        });
    } else {
        fs.appendFileSync('./data/generatedPhrasesNonScifi.txt', phrase + '\n', err => {
            if (err) {
                console.error(err.red.bold);
                return;
            }
        });
    }
}

for(let i=0; i<runCount; i++)
    await buildPhrase();


import { readFile } from 'fs/promises';
const scifiTerms = JSON.parse(await readFile(new URL('./scifiTerms.json', import.meta.url)));

let descriptors = scifiTerms.descriptor;
let subjects = scifiTerms.subject;
let actions = scifiTerms.action;

export const choosePath = async () => {
    let choices = ['descriptor', 'subject', 'action']
    let c1 = choices[Math.floor(Math.random() * choices.length)];
    choices = choices.filter(choice => choice !== c1);
    let c2 = choices[Math.floor(Math.random() * choices.length)];
    choices = choices.filter(choice => choice !== c2);
    let c3 = choices[0];

    return [c1, c2, c3];
}

export const findDescriptor = async () => {
    return descriptors[Math.floor(Math.random() * descriptors.length)]
}
export const findSubject = async () => {
    return subjects[Math.floor(Math.random() * subjects.length)];
}
export const findAction = async () => {
    return actions[Math.floor(Math.random() * actions.length)];
}







/********** PHRASE LOGIC V2 ***********/

const determinePhraseLogic = async (segments) => {
    let logicFailure = 0;
    let compatibilityString;

    /***** CHECK SEGMENT ONE AGAINST SEGMENT TWO *****/
    compatibilityString = await compareSegmentAttributes(segments[0], segments[1])

    if(compatibilityString === '') {
        console.log(('ERROR: Incompatible(1-2): "' + segments[0].segment + '" WITH "' + segments[1].segment + '"').red.bold);
        console.log('');
        logicFailure = 1;
        return logicFailure;
    } else {
        console.log('Compatible(1-3): ' + compatibilityString)
    }

    /***** CHECK SEGMENT ONE AGAINST SEGMENT THREE *****/
    compatibilityString = await compareSegmentAttributes(segments[0], segments[2])

    if(compatibilityString === '') {
        console.log(('ERROR: Incompatible(1-3): "' + segments[0].segment + '" WITH "' + segments[2].segment + '"').red.bold);
        console.log('');
        logicFailure = 2;
        return logicFailure;
    } else {
        console.log('Compatible(1-3): ' + compatibilityString)
    }

    /***** CHECK SEGMENT TWO AGAINST SEGMENT THREE *****/
    compatibilityString = await compareSegmentAttributes(segments[1], segments[2])

    if(compatibilityString === '') {
        console.log(('ERROR: Incompatible(2-3): "' + segments[1].segment + '" WITH "' + segments[2].segment + '"').red.bold);
        console.log('');
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








/********** PHRASE LOGIC V1 ***********/

// const determinePhraseLogic = async (segments) => {
//     //console.log(segments[0], segments[1], segments[2]);
//     let logicFailure = 0;
//     let anthropomorphic = false;
//     let emotionable = false;
//     let technical = false;
//     let locational = false;
//     let scifiRelated = false;
//     let compatiblityString = '';
    

//     /***** CHECK SEGMENT TWO AGAINST SEGMENT ONE *****/
//     if (segments[0]['anthropomorphic'] == 'Y' && segments[1]['anthropomorphic'] == 'Y')
//         anthropomorphic = true;
//     if (segments[0]['emotionable'] == 'Y' && segments[1]['emotionable'] == 'Y')
//         emotionable = true;
//     if (segments[0]['technical'] == 'Y' && segments[1]['technical'] == 'Y')
//         technical = true;
//     if (segments[0]['locational'] == 'Y' && segments[1]['locational'] == 'Y')
//         locational = true;
//     if (!(anthropomorphic || emotionable || technical || locational)) {
//         logicFailure = 1;
//         console.log(('ERROR: Incompatible(1-2): "' + segments[0].segment + '" WITH "' + segments[1].segment + '"').red.bold);
//         console.log('');
//         return logicFailure;
//     } else {
//         if (anthropomorphic)
//             compatiblityString += 'anthropomorphic ';
//         if (emotionable)
//             compatiblityString += 'emotionable ';
//         if (technical)
//             compatiblityString += 'technical ';
//         if (locational)
//             compatiblityString += 'locational '
//         console.log('Compatible(1-2): ' + compatiblityString)
//     }

//     /***** CHECK SEGMENT THREE AGAINST SEGMENT ONE *****/
//     logicFailure = 0;
//     anthropomorphic = false;
//     emotionable = false;
//     technical = false;
//     locational = false;
//     compatiblityString = '';
    
//     if (segments[0]['anthropomorphic'] == 'Y' && segments[2]['anthropomorphic'] == 'Y')
//         anthropomorphic = true;
//     if (segments[0]['emotionable'] == 'Y' && segments[2]['emotionable'] == 'Y')
//         emotionable = true;
//     if (segments[0]['technical'] == 'Y' && segments[2]['technical'] == 'Y')
//         technical = true;
//     if (segments[0]['locational'] == 'Y' && segments[2]['locational'] == 'Y')
//         locational = true;
//     if (!(anthropomorphic || emotionable || technical || locational)) {
//         logicFailure = 2;
//         console.warn(('ERROR: Incompatible(1-3): "' + segments[2].segment + '" WITH "' + segments[0].segment + '"').red.bold);
//         console.log('');
//         return logicFailure;
//     } else {
//         if (anthropomorphic)
//             compatiblityString += 'anthropomorphic ';
//         if (emotionable)
//             compatiblityString += 'emotionable ';
//         if (technical)
//             compatiblityString += 'technical ';
//         if (locational)
//             compatiblityString += 'locational '
//         console.log('Compatible(1-3): ' + compatiblityString)
//     }

//     /***** CHECK SEGMENT THREE AGAINST SEGMENT TWO *****/
//     logicFailure = 0;
//     // anthropomorphic = false;
//     // emotionable = false;
//     // technical = false;
//     // locational = false;
//     compatiblityString = '';
    
//     if (anthropomorphic && segments[1]['anthropomorphic'] == 'Y' && segments[2]['anthropomorphic'] == 'Y')
//         anthropomorphic = true;
//     if (emotionable && segments[1]['emotionable'] == 'Y' && segments[2]['emotionable'] == 'Y')
//         emotionable = true;
//     if (technical && segments[1]['technical'] == 'Y' && segments[2]['technical'] == 'Y')
//         technical = true;
//     if (locational && segments[1]['locational'] == 'Y' && segments[2]['locational'] == 'Y')
//         locational = true;
//     if (!(anthropomorphic || emotionable || technical || locational)) {
//         logicFailure = 2;
//         console.warn(('ERROR: Incompatible(2-3): "' + segments[2].segment + '" WITH "' + segments[1].segment + '"').red.bold);
//         console.log('');
//         return logicFailure;
//     } else {
//         if (anthropomorphic)
//             compatiblityString += 'anthropomorphic ';
//         if (emotionable)
//             compatiblityString += 'emotionable ';
//         if (technical)
//             compatiblityString += 'technical ';
//         if (locational)
//             compatiblityString += 'locational '
//         console.log('Compatible(2-3): ' + compatiblityString)
//     }

//     return logicFailure;
// }
import {getDoc, doc, setDoc, updateDoc} from "firebase/firestore";
import * as crypto from './encrypt.js';

// Get user from database given the unique username
export async function getUser(db, username) {
    // Set path
    const userRef = doc(db, "users", username)
    const userInfo = await getDoc(userRef)
    let user = null

    // If userInfo exists, return the data, else data returned is null
    if (userInfo.exists()) {
        user = userInfo.data()
        console.log("Document data:", userInfo.data());
    }
    else {
        console.log("User does not exist");
    }

    return user
}

// Given the unique username, get Scores from database belonging to that username
export async function getScores(db, username) {
    // Set path
    const userRef = doc(db, "users", username)
    const userInfo = await getDoc(userRef)

    // Get list of score IDs belonging to that user
    let userScores = userInfo.data().scores
    let returnScores = []

    // Get each score with those IDs
    for(let i = 0; i < userScores.length; i++){
        let id = userScores[i]
        let scoreRef = doc(db, "scores", id.toString())
        let score = await getDoc(scoreRef)
        returnScores.push(score.data())
    }

    return returnScores
}

// Given the id and password of a score, get that score. This is used for joining a score
// that does not belong to the requester
export async function findScore(db, id, pass) {
    // Set path
    let scoreRef = doc(db, "scores", id.toString())
    let score = await getDoc(scoreRef)
    let returnScore = null

    // If score exists, return the data, else data returned is null
    if(score.data() !== undefined){
        if(score.data().pass === pass) {
            returnScore = score.data()
        }
    }

    return returnScore
}

// Create a score given the username of the user creating it, the name, base score, and the random password
export async function createScore(db, username, name, score, pass) {

    // Get score counter to create unique IDs and increment
    const counterRef = doc(db, "counters", "scorecounter")
    const counter = await getDoc(counterRef)
    let countInt = counter.data().count

    // Set new counter for next score
    let newCount = countInt + 1
    await setDoc(counterRef, {count: newCount})

    // Set score
    const scoreRef = doc(db, "scores", countInt.toString())
    await setDoc(scoreRef, {id: countInt, user: username, name: name, score: score, pass: pass, image: "/assets/default.png"})

    // Set path to user and get the user
    const userRef = doc(db, "users", username)
    const user = await getDoc(userRef)

    // Add the new score id to the list of score owned by that user
    let userScores = user.data().scores
    userScores.push(countInt)
    await updateDoc(userRef, { scores: userScores })
}

// Change name of a score given the id and the new name
export async function changeName(db, id, name) {

    const scoreRef = doc(db, "scores", id.toString())
    await updateDoc(scoreRef, { name: name })
}

// Change password of a score given the id and the new password
export async function changePass(db, id, pass) {

    const scoreRef = doc(db, "scores", id.toString())
    await updateDoc(scoreRef, { pass: pass })
}

// Update and save an image to the database as a dataurl -> the image is a snapshot of the score
export async function saveImage(db, id, image) {
    // Set image
    const scoreRef = doc(db, "scores", id.toString())
    await updateDoc(scoreRef, { image: image })
}

// Update and save a score to the database as a string
export async function saveScore(db, id, score) {
    // Set score
    const scoreRef = doc(db, "scores", id.toString())
    await updateDoc(scoreRef, { score: score })
}

// Create a new user given a unique username and the password
export async function createUser(db, username, password) {
    const userRef = doc(db, "users", username)

    // Encrypt and send ciphertext and IV
    let encryptedPass = crypto.encrypt(password)
    await setDoc(userRef, { username: username, password: encryptedPass.ciphertext, salt: encryptedPass.iv, scores: [] })
}


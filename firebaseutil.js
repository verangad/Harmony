import {collection, getDoc, doc, setDoc, updateDoc} from "firebase/firestore";
import {getDatabase, onValue, ref} from "firebase/database";
import * as crypto from './encrypt.js';


export async function getUser(db, username) {
    const userRef = doc(db, "users", username)
    const userInfo = await getDoc(userRef)
    let user = null
    console.log("MASDE")

    if (userInfo.exists()) {
        user = userInfo.data()
        console.log("Document data:", userInfo.data());
    } else {
        console.log("User does not exist");
    }

    return user
}

export async function getScores(db, username) {
    const userRef = doc(db, "users", username)
    const userInfo = await getDoc(userRef)
    let userScores = userInfo.data().scores
    console.log(userScores)
    let returnScores = []

    for(let i = 0; i < userScores.length; i++){
        let id = userScores[i]
        let scoreRef = doc(db, "scores", id.toString())
        let score = await getDoc(scoreRef)
        returnScores.push(score.data())
    }

    return returnScores
}

export async function findScore(db, name, pass) {
    let scoreRef = doc(db, "scores", name.toString())
    let score = await getDoc(scoreRef)
    let returnScore = null

    if(score.data().pass === pass) {
        returnScore = score.data()
    }

    return returnScore
}


export async function createScore(db, username, name, score, pass) {
    console.log("SADFHDDA SFFSA", pass)
    // Get score counter to create unique IDs and increment
    const counterRef = doc(db, "counters", "scorecounter")
    const counter = await getDoc(counterRef)
    let countInt = counter.data().count

    // Set new counter for next score
    let newCount = countInt + 1
    await setDoc(counterRef, {count: newCount})

    // Set score
    const scoreRef = doc(db, "scores", countInt.toString())
    await setDoc(scoreRef, {id: countInt, user: username, name: name, score: score, pass: pass})


    const userRef = doc(db, "users", username)
    const user = await getDoc(userRef)
    let userScores = user.data().scores
    console.log(user.data())
    userScores.push(countInt)
    await updateDoc(userRef, { scores: userScores })
}


export async function saveImage(db, id, image) {
    // Set image
    const scoreRef = doc(db, "scores", id.toString())
    await updateDoc(scoreRef, { image: image })
}

export async function saveScore(db, id, score) {
    // Set score
    const scoreRef = doc(db, "scores", id.toString())
    await updateDoc(scoreRef, { score: score })
}


export async function createUser(db, username, password) {
    const userRef = doc(db, "users", username)
    let encryptedPass = crypto.encrypt(password)
    await setDoc(userRef, { username: username, password: encryptedPass.ciphertext, salt: encryptedPass.iv, scores: [] })
}


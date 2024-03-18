import {collection, getDoc, doc, setDoc} from "firebase/firestore";
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


export async function createUser(db, username, password) {
    const userRef = doc(db, "users", username)
    let encryptedPass = crypto.encrypt(password)
    await setDoc(userRef, { username: username, password: encryptedPass.ciphertext, salt: encryptedPass.iv })
}


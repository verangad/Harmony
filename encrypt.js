import crypto from 'crypto'

const algorithm = 'aes-256-cbc';

const stringKey = "3fc47972bdaeafb6111adba4a33261027ed033051a06f88581d8e394d835a0c2"
const key = Buffer.from(stringKey, "hex");




export function encrypt(pass) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    const ivStr = iv.toString("hex");
    let salted_pass = pass + ivStr
    let ciphertext = cipher.update(salted_pass, 'utf8', 'hex');
    ciphertext += cipher.final('hex');

    return { ciphertext: ciphertext, iv: ivStr }
}

export function decrypt(pass, iv) {
    let ivBuffer = Buffer.from(iv, "hex");
    const decipher = crypto.createDecipheriv(algorithm, key, ivBuffer);
    let plaintext = decipher.update(pass, 'hex', 'utf8');
    plaintext += decipher.final('utf8');
    plaintext = plaintext.substring(0, plaintext.length-iv.length);

    return plaintext
}

export function checkPassword(pass, ciphertext) {
    let validPass = false
    let plaintext = decrypt(ciphertext)
    if(pass === plaintext)
    {
        validPass = true
    }

    return validPass
}

export function generatePassword(){
    const ranArr = new Uint32Array(1);
    crypto.getRandomValues(ranArr);

    return ranArr[0].toString()
}
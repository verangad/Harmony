import crypto from 'crypto'

const algorithm = 'aes-256-cbc';
const stringKey = "3fc47972bdaeafb6111adba4a33261027ed033051a06f88581d8e394d835a0c2"
const key = Buffer.from(stringKey, "hex");

// Given a string password, encrypt it with AES-256-cbc with the key and an IV as a salt
export function encrypt(pass) {

    // Generate IV
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    const ivStr = iv.toString("hex");

    // Add salt to password
    let salted_pass = pass + ivStr

    // Encrypt salted password
    let ciphertext = cipher.update(salted_pass, 'utf8', 'hex');
    ciphertext += cipher.final('hex');

    // Return ciphertext and salt
    return { ciphertext: ciphertext, iv: ivStr }
}

// Given a string ciphertext and an IV, decrypt it with AES-256-cbc
export function decrypt(pass, iv) {

    // Create decipher IV
    let ivBuffer = Buffer.from(iv, "hex");
    const decipher = crypto.createDecipheriv(algorithm, key, ivBuffer);

    // Decrypt
    let plaintext = decipher.update(pass, 'hex', 'utf8');
    plaintext += decipher.final('utf8');

    // Remove IV from decrypted text
    plaintext = plaintext.substring(0, plaintext.length-iv.length);

    // Return original
    return plaintext
}

// Generate a random number password for the scores
export function generatePassword(){
    const ranArr = new Uint32Array(1);
    crypto.getRandomValues(ranArr);

    return ranArr[0].toString()
}
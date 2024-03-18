import crypto from 'crypto'
import * as c from './encrypt.js'
/*
const ey = crypto.randomBytes(32);
console.log(ey)
const resultStr = ey.toString("hex");
console.log(resultStr)

const buff = Buffer.from(resultStr, "hex");

console.log(buff)*/

let p = c.encrypt("test1234")
console.log(p)
let f = c.decrypt(p.ciphertext, p.iv)
console.log(f)
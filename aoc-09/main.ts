
import { readFileSync } from 'node:fs'

const file = readFileSync('./input.txt', 'utf-8').trim()
const lines = file.split('\n')

interface Block {
    type: string,
    id?: number
}

const diskmap: string = lines[0]
const blocks: Block[] = []
let blockCount = 0
let charCount = 0
let fileId = 0
for (const char of diskmap) {
    const len = parseInt(char)
    if (charCount % 2 === 0) {
        for (let i = 0; i < len; i++) {
            blocks.push({ type: "file", id: fileId })
        }
        fileId++
    } else {
        for (let i = 0; i < len; i++) {
            blocks.push({ type: "space" })
        }
    }
    blockCount += len
    charCount += 1
}

// console.log(blockCount)
// console.log(blocks)

let gaps: Block[] = []
let pointer = blocks.length - 1
do {
    if (blocks[pointer].type === "space") {
        pointer -= 1
        continue
    }
    if (blocks[pointer].type === "file") {
        const freeInd = blocks.findIndex((val) => val.type === "space")
        blocks[freeInd] = blocks[pointer]
        blocks[pointer] = { type: "space" }
        pointer -= 1
    }
    gaps = blocks.slice(0, blocks.findLastIndex((val) => val.type === "file")).filter((val) => val.type === "space")
} while (gaps.length > 0 && pointer >= 0)

// console.log(blocks)

let checksum = 0
let cnt = 0
for (const blck of blocks) {
    if (blck.type === "file" && blck.id !== undefined) {
        checksum += blck.id * cnt
    }
    cnt++
}

console.log(`What is the resulting filesystem checksum? ${checksum}`)

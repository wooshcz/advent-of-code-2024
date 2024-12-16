
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
const blocks2: Block[] = [...blocks]

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

console.log(`What is the resulting filesystem checksum? (part 1) ${checksum}`)


for (let id = fileId - 1; id >= 0; id--) {
    // console.log(blocks2)
    const fileblocks = blocks2.filter((val) => val.id === id)
    const fileblockStart = blocks2.findIndex((val) => val.id === id)
    const freeSpace = blocks2.findIndex((_val, ind) => {
        for (let j = ind, cnt = 0; cnt < fileblocks.length && j < fileblockStart; j++, cnt++) {
            // console.log(j, blocks2[j])
            if (blocks2[j].type !== "space") return false
            else if (cnt === fileblocks.length - 1) return true
        }
        return false
    })
    if (freeSpace !== -1) {
        for (let x = 0; x < fileblocks.length; x++) {
            blocks2[freeSpace + x] = blocks2[fileblockStart + x]
            blocks2[fileblockStart + x] = { type: "space" }
        }
        // console.log(`Moving file ID ${id} to ${freeSpace}`)
    }
    // console.log(fileblocks, freeSpace)
}

let checksum2 = 0
let cnt2 = 0
for (const blck of blocks2) {
    if (blck.type === "file" && blck.id !== undefined) {
        checksum2 += blck.id * cnt2
    }
    cnt2++
}

console.log(`What is the resulting filesystem checksum? (part 2) ${checksum2}`)

import { readFileSync } from 'node:fs'

const file = readFileSync('./input.txt', 'utf-8').trim()
const lines = file.split('\n')
const NO_BLINKS = 25

let nextline = lines[0]

for (let id = 1; id <= NO_BLINKS; id++) {
    const start: number = Date.now()
    let pntr = 0
    const stones: string[] = nextline.split(" ")
    do {
        // console.log(pntr, stones)
        const stone = stones[pntr]
        const stoneNum = parseInt(stone)
        const strlen = stone.length
        if (stoneNum === 0) {
            stones[pntr] = "1"
        } else if (strlen % 2 === 0) {
            stones[pntr] = stone.substring(0, strlen / 2)
            stones.splice(pntr + 1, 0, parseInt(stone.substring(strlen / 2)).toString())
            pntr++
        } else {
            stones[pntr] = (2024 * stoneNum).toString()
        }
        pntr++
        // console.log(pntr, stones)
    } while (pntr < stones.length)
    nextline = stones.join(" ")
    const stop: number = Date.now()
    const duration: number = (stop - start) / 1000
    console.log(`Blink: ${id}. Number of stones: ${stones.length}, processing time: ${duration}s`)
}

console.log(nextline.split(" ").length)
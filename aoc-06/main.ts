
import { readFileSync } from 'node:fs'

const file = readFileSync('./input.txt', 'utf-8').trim()
const lines = file.split('\n')
const GUARD = "^"
const OBSTACLE = "#"
const PAST_MOVE = "X"

const map: string[][] = []
let guardCoord: XYCoords
let guardFacing = "up"

interface XYCoords {
    x: number,
    y: number,
}

function guardTurns() {
    switch (guardFacing) {
        case "up":
            guardFacing = "right"
            break
        case "right":
            guardFacing = "down"
            break
        case "down":
            guardFacing = "left"
            break
        case "left":
            guardFacing = "up"
            break
    }
}


function insideBoundary(): boolean {
    if (guardCoord.x < MAP_SIZE_X && guardCoord.x >= 0 && guardCoord.y < MAP_SIZE_Y && guardCoord.y >= 0) {
        return true
    } else {
        return false
    }
}

function moveGuard() {
    map[guardCoord.y][guardCoord.x] = PAST_MOVE
    switch (guardFacing) {
        case "up":
            guardCoord.y--
            break
        case "right":
            guardCoord.x++
            break
        case "down":
            guardCoord.y++
            break
        case "left":
            guardCoord.x--
            break
        default:
            throw Error("Unknown error in moveGuard()")
    }
    try {
        map[guardCoord.y][guardCoord.x] = GUARD
    } catch (e: any) {
        console.log(e)
        console.log("Guard is leaving the map")
    }
}

function isFacingObstacle(): boolean {
    try {
        switch (guardFacing) {
            case "up":
                return map[guardCoord.y - 1][guardCoord.x] === OBSTACLE
            case "right":
                return map[guardCoord.y][guardCoord.x + 1] === OBSTACLE
            case "down":
                return map[guardCoord.y + 1][guardCoord.x] === OBSTACLE
            case "left":
                return map[guardCoord.y][guardCoord.x - 1] === OBSTACLE
            default:
                throw Error("Unknown error in isFacingObstacle()")
        }
        // deno-lint-ignore no-explicit-any
    } catch (e: any) {
        console.log(e)
        return false
    }
}

const MAP_SIZE_X = lines[0].length
const MAP_SIZE_Y = lines.length

for (let id = 0; id < lines.length; id++) {
    const line = lines[id]
    map.push(line.split(""))
    if (line.indexOf(GUARD) > -1) {
        guardCoord = { x: line.indexOf(GUARD), y: id }
    }
}

// console.log(map)

let moveCount = 0
while (insideBoundary()) {
    if (isFacingObstacle()) {
        guardTurns()
    } else {
        moveGuard()
    }
    console.log(`Move counter: ${++moveCount}`)
}

const distinctPositions = map.flat().filter((value) => { return value === PAST_MOVE }).length

console.log(`Part 1: Number of distinct positions recorded: ${distinctPositions}`)

import { readFileSync } from 'node:fs'

const file = readFileSync('./input.txt', 'utf-8').trim()
const lines = file.split('\n')
const GUARD = "^"
const OBSTACLE = "#"

enum Directions { Up, Right, Down, Left }
const ROTATION_MAP = new Map<Directions, Directions>([
    [Directions.Up, Directions.Right],
    [Directions.Right, Directions.Down],
    [Directions.Down, Directions.Left],
    [Directions.Left, Directions.Up]
])

const map: string[][] = []

interface XYCoords {
    x: number,
    y: number,
}

class Guard {

    position: XYCoords
    facing: Directions | undefined
    map: string[][]
    history: string[] = []

    constructor(initPos: XYCoords, initFacing: Directions, map: string[][]) {
        this.position = initPos
        this.facing = initFacing
        this.map = map
    }

    turn() {
        if (this.facing == undefined) throw new Error("Guard cannot turn, facing is not defined!")
        this.facing = ROTATION_MAP.get(this.facing)
        // console.log(`Guard turns`)
    }

    move() {
        this.history.push(JSON.stringify({ ...this.position, dir: this.facing }))
        switch (this.facing) {
            case Directions.Up:
                this.position.y--
                break
            case Directions.Right:
                this.position.x++
                break
            case Directions.Down:
                this.position.y++
                break
            case Directions.Left:
                this.position.x--
                break
            default:
                throw Error("Unknown error in moveGuard()")
        }
        if (!this.isInsideBoundary()) {
            // console.log("Guard is leaving the map")
        }
    }

    isInsideBoundary(): boolean {
        if (this.position.x < MAP_SIZE_X && this.position.x >= 0 && this.position.y < MAP_SIZE_Y && this.position.y >= 0) {
            return true
        } else {
            return false
        }
    }

    isFacingObstacle(): boolean {
        try {
            switch (this.facing) {
                case Directions.Up:
                    return this.map[this.position.y - 1][this.position.x] === OBSTACLE
                case Directions.Right:
                    return this.map[this.position.y][this.position.x + 1] === OBSTACLE
                case Directions.Down:
                    return this.map[this.position.y + 1][this.position.x] === OBSTACLE
                case Directions.Left:
                    return this.map[this.position.y][this.position.x - 1] === OBSTACLE
                default:
                    throw Error("Unknown error in isFacingObstacle()")
            }
            // deno-lint-ignore no-explicit-any
        } catch (_e: any) {
            return false
        }
    }
}

function getObstacleCoords(guard: Guard) {
    try {
        switch (guard.facing) {
            case Directions.Up:
                return { x: guard.position.x, y: guard.position.y - 1 }
            case Directions.Right:
                return { x: guard.position.x + 1, y: guard.position.y }
            case Directions.Down:
                return { x: guard.position.x, y: guard.position.y + 1 }
            case Directions.Left:
                return { x: guard.position.x - 1, y: guard.position.y }
            default:
                throw Error("Unknown error in getObstacleCoords()")
        }
        // deno-lint-ignore no-explicit-any
    } catch (_e: any) {
        return undefined
    }
}

function possibleLoop(guard: Guard, map: string[][]): boolean {
    try {
        switch (guard.facing) {
            case Directions.Up: {
                // if (guard.position.y === 0) return false
                const _row: string[] = map[guard.position.y]
                return _row.indexOf(OBSTACLE, guard.position.x) !== -1
            }
            case Directions.Right: {
                // if (guard.position.x === MAP_SIZE_X - 1) return false
                const _column: string[] = []
                for (const row of map) {
                    _column.push(row[guard.position.x])
                }
                return _column.indexOf(OBSTACLE, guard.position.y) !== -1
            }
            case Directions.Down: {
                // if (guard.position.y === MAP_SIZE_Y - 1) return false
                const _row: string[] = map[guard.position.y]
                return _row.lastIndexOf(OBSTACLE, guard.position.x) !== -1
            }
            case Directions.Left: {
                // if (guard.position.x === 0) return false
                const _column: string[] = []
                for (const row of map) {
                    _column.push(row[guard.position.x])
                }
                return _column.lastIndexOf(OBSTACLE, guard.position.y) !== -1
            }
            default:
                throw Error("Unknown error in familiarPath()")
        }
        // deno-lint-ignore no-explicit-any
    } catch (_e: any) {
        return false
    }
}

function closesLoop(guard: Guard, map: string[][]): boolean {
    if (guard.facing == undefined) throw new Error("Guard cannot turn, facing is not defined!")
    const tempGuard = new Guard({ ...guard.position }, guard.facing, map)
    let moveCount = 0
    while (tempGuard.isInsideBoundary()) {
        if (tempGuard.isFacingObstacle()) {
            tempGuard.turn()
        } else {
            tempGuard.move()
            moveCount++
            // console.log(`Loop move counter: ${moveCount} | ${tempGuard.position.x}:${tempGuard.position.y} | ${guard.position.x}:${guard.position.y}`)
            const _histKey = JSON.stringify({ ...tempGuard.position, dir: tempGuard.facing })
            if (tempGuard.history.includes(_histKey)) {
                // console.log("Guard has reached the same square having the same orientation")
                return true
            }
        }
    }
    return false
}

function walkThroughMap(guard: Guard, newObstacles: string[]): string[][] {
    let moveCount = 0
    while (guard.isInsideBoundary()) {
        if (guard.isFacingObstacle()) {
            guard.turn()
        } else {
            if (possibleLoop(guard, map)) {
                // console.log("Possible loop detected!")
                const newObstacle = getObstacleCoords(guard)
                const tempMap = JSON.parse(JSON.stringify(map))
                if (newObstacle !== undefined) {
                    tempMap[newObstacle.y][newObstacle.x] = OBSTACLE
                    if (closesLoop(guard, tempMap)) {
                        // console.log(`Loop confirmed on move ${moveCount}!`)
                        if (!newObstacles.includes(JSON.stringify(newObstacle))
                            && JSON.stringify(newObstacle) !== JSON.stringify(guardCoord)) {
                            newObstacles.push(JSON.stringify(newObstacle))
                        }
                    } else {
                        // console.log(`Loop was not confirmed, continue ...`)
                    }
                }
            }
            guard.move()
            moveCount++
            // console.log(`Main move counter: ${moveCount} | ${guard.position.x}:${guard.position.y}:${guard.facing}`)
        }
        // console.log(guard.position, guard.facing)
    }
    return map
}


const MAP_SIZE_X = lines[0].length
const MAP_SIZE_Y = lines.length
const guardCoord: XYCoords = { x: -1, y: -1 }
const guardFacing = Directions.Up

for (let id = 0; id < lines.length; id++) {
    const line = lines[id]
    map.push(line.split(""))
    if (line.indexOf(GUARD) > -1) {
        guardCoord.x = line.indexOf(GUARD)
        guardCoord.y = id
    }
}

const guard = new Guard(guardCoord, guardFacing, map)
const newObstructions: string[] = []
walkThroughMap(guard, newObstructions)
const historyPositions = []
for (const _hist of guard.history) {
    historyPositions.push(JSON.stringify({ x: JSON.parse(_hist).x, y: JSON.parse(_hist).y }))
}
const distinctPositions = [... new Set(historyPositions)].length
console.log(`Part 1: Number of distinct positions recorded: ${distinctPositions}`)

// TODO: Still not correct :(
console.log(`Part 2: Number of possible places for new obstructions that cause loops: ${newObstructions.length}`)

for (const pos of historyPositions) {
    map[JSON.parse(pos).y][JSON.parse(pos).x] = "o"
}
for (const pos of newObstructions) {
    map[JSON.parse(pos).y][JSON.parse(pos).x] = "@"
}
for (const row of map) {
    console.log(row.join(""))
}

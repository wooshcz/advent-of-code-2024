
import { readFileSync } from 'node:fs'

const file = readFileSync('./input.txt', 'utf-8').trim()
const lines = file.split('\n')

interface XYCoords {
    x: number,
    y: number,
}

const map: number[][] = []
const trailheads: XYCoords[] = []

let y = 0
for (const line of lines) {
    const row: number[] = []
    let x = 0
    for (const char of line) {
        const _num = parseInt(char)
        row.push(_num)
        if (_num === 0) {
            trailheads.push({ x: x, y: y })
        }
        x++
    }
    map.push(row)
    y++
}

// console.log(map)
// console.log(trailheads)


const findNearestSteps = (coord: XYCoords) => {
    const _val = map[coord.y][coord.x]
    const _out: XYCoords[] = []
    try { if (map[coord.y - 1][coord.x] === _val + 1) { _out.push({ x: coord.x, y: coord.y - 1 }) } } catch (_e) { }
    try { if (map[coord.y + 1][coord.x] === _val + 1) { _out.push({ x: coord.x, y: coord.y + 1 }) } } catch (_e) { }
    try { if (map[coord.y][coord.x - 1] === _val + 1) { _out.push({ x: coord.x - 1, y: coord.y }) } } catch (_e) { }
    try { if (map[coord.y][coord.x + 1] === _val + 1) { _out.push({ x: coord.x + 1, y: coord.y }) } } catch (_e) { }
    return _out
}


const calulcateScoreOfTrailhead = (coord: XYCoords, peaks: XYCoords[]) => {
    const _val = map[coord.y][coord.x]
    // console.log(`Calculate score start: ${coord.x}:${coord.y}, val: ${_val}`)
    if (_val === 9 && peaks.filter((val) => val.x === coord.x && val.y === coord.y).length === 0) {
        // console.log(`Peak was reached at: ${coord.x}:${coord.y}`)
        peaks.push({ x: coord.x, y: coord.y })
        return 1
    }
    else {
        let score = 0
        const steps = findNearestSteps(coord)
        while (steps.length > 0) {
            const step = steps.pop()
            if (step == undefined) break
            // console.log(`Step: ${step.x}:${step.y}`)
            score += calulcateScoreOfTrailhead(step, peaks)
        }
        return score
    }
}


const getPathsFromTrailhead = (coord: XYCoords, paths: string[], history: XYCoords[]) => {
    const _val = map[coord.y][coord.x]
    // console.log(`Calculate score start: ${coord.x}:${coord.y}, val: ${_val}`)
    if (_val === 9 && !paths.includes(JSON.stringify(history))) {
        // console.log(`Peak was reached at: ${coord.x}:${coord.y}`)
        paths.push(JSON.stringify(history))
    }
    else {
        const steps = findNearestSteps(coord)
        while (steps.length > 0) {
            const step = steps.pop()
            if (step == undefined) break
            // console.log(`Step: ${step.x}:${step.y}`)
            history.push(step)
            getPathsFromTrailhead(step, paths, [...history])
        }
    }
}


let score = 0
let rating = 0
for (const th of trailheads) {
    const paths: string[] = []
    score += calulcateScoreOfTrailhead(th, [])
    getPathsFromTrailhead(th, paths, [])
    // console.log(th, paths)
    rating += paths.length
}

console.log(`What is the sum of the scores of all trailheads?: (part 1) ${score}`)

console.log(`What is the sum of the ratings of all trailheads?: (part 2) ${rating}`)

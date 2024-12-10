
import { readFileSync } from 'node:fs'

const file = readFileSync('./input.txt', 'utf-8').trim()
const lines = file.split('\n')
const DOT = "."

interface XYCoords {
    x: number
    y: number
}

interface Antinode {
    pos: XYCoords
}

interface Antenna {
    pos: XYCoords
    freq: string
}

const antennas: Antenna[] = []
const frequencies = new Set<string>()
const antinodes: Antinode[] = []
const MAX_X = lines[0].length - 1
const MAX_Y = lines.length - 1

let _row = 0
for (const line of lines) {
    let _col = 0
    for (const it of line) {
        if (it !== DOT) {
            antennas.push({ pos: { x: _col, y: _row }, freq: it })
            frequencies.add(it)
        }
        _col++
    }
    _row++
}

const isInsideBoundary = (pos: XYCoords) => {
    return (pos.x >= 0 && pos.x <= MAX_X && pos.y >= 0 && pos.y <= MAX_Y)
}

// console.log(antennas)
// console.log(frequencies)

for (const fr of frequencies) {
    const antslice = antennas.filter((val) => { return val.freq === fr })
    while (antslice.length > 0) {
        const _ant1 = antslice.pop()
        if (_ant1 === undefined) continue
        for (const _ant2 of antslice) {
            const _vec = { x: _ant1.pos.x - _ant2.pos.x, y: _ant1.pos.y - _ant2.pos.y }
            // console.log(_ant1, _ant2, _vec)
            const _antinode1 = { pos: { x: _ant1.pos.x + _vec.x, y: _ant1.pos.y + _vec.y } }
            const _antinode2 = { pos: { x: _ant2.pos.x - _vec.x, y: _ant2.pos.y - _vec.y } }
            for (const an of [_antinode1, _antinode2]) {
                if (isInsideBoundary(an.pos) && antinodes.filter((val) => val.pos.x === an.pos.x && val.pos.y === an.pos.y).length === 0) {
                    antinodes.push(an)
                }
            }
        }
    }
}


console.log(`Number of unique antinodes: ${antinodes.length}`)

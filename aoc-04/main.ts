
import { readFileSync } from 'node:fs'

const file = readFileSync('./input.txt', 'utf-8').trim()
const lines = file.split('\n')
const WORD = "XMAS"


function getHorizontalLines(lines: string[]): string[] {
    const horizlines: string[] = []
    for (const line of lines) {
        horizlines.push(line)
        horizlines.push(line.split("").toReversed().join(""))
    }
    return horizlines
}


function getVerticalLines(lines: string[]): string[] {
    const vertlines: string[] = []
    for (let column = 0; column < lines[0].length; column++) {
        let vertline = ""
        for (const line of lines) {
            vertline += line[column]
        }
        vertlines.push(vertline)
        vertlines.push(vertline.split("").toReversed().join(""))
    }
    return vertlines
}


function getDiagonalLines(lines: string[]): string[] {
    const diaglines: string[] = []
    for (let diag = 0; diag < lines.length * 2 - 1; diag++) {
        let diagline = ""
        for (let col = Math.max(0, diag - lines.length + 1), row = Math.min(diag, lines.length - 1);
            col < lines.length && row >= 0;
            col++, row--) {
            // console.log(lines[row][col])
            diagline += lines[row][col]
        }
        if (diagline.length >= WORD.length) {
            diaglines.push(diagline)
            diaglines.push(diagline.split("").toReversed().join(""))
        }
    }

    for (let diag = 0; diag < lines.length * 2 - 1; diag++) {
        let diagline = ""
        for (let row = Math.max(0, lines.length - diag - 1), col = Math.max(0, diag - lines.length + 1);
            col < lines.length && row < lines.length;
            col++, row++) {
            diagline += lines[row][col]
        }
        if (diagline.length >= WORD.length) {
            diaglines.push(diagline)
            diaglines.push(diagline.split("").toReversed().join(""))
        }
    }
    return diaglines
}


const searcharray = []
const _horiz: string[] = getHorizontalLines(lines)
const _vert: string[] = getVerticalLines(lines)
const _diag: string[] = getDiagonalLines(lines)

searcharray.push(..._horiz)
searcharray.push(..._vert)
searcharray.push(..._diag)

let sum = 0
for (const testline of searcharray) {
    const _matches = [...testline.matchAll(new RegExp(WORD, "g"))]
    sum += _matches.length
}

console.log(`Number of occurrences of the word ${WORD}: ${sum}`)


function isValidShape(row1: string, row2: string, row3: string): boolean {
    if (row1?.length != 3 || row2?.length != 3 || row3?.length != 3) return false
    const seg1 = row1[0] + row2[1] + row3[2]
    const seg2 = row1[2] + row2[1] + row3[0]
    // console.log(`seg1: ${seg1}, seg2: ${seg2}`)
    if (seg1.match(/MAS|SAM/g) && seg2.match(/MAS|SAM/g)) return true
    else return false
}

let _line = ""
let sum2 = 0
for (let rowid = 0; rowid < lines.length; rowid++) {
    _line = lines[rowid]
    const _matches = [..._line.matchAll(/A/g)]
    for (const match of _matches) {
        // console.log(match)
        if (isValidShape(
            lines[rowid - 1]?.slice(match.index - 1, match.index + 2),
            _line.slice(match.index - 1, match.index + 2),
            lines[rowid + 1]?.slice(match.index - 1, match.index + 2))) {
            sum2 += 1
        }
    }
}


console.log(`Number of valid X-MAS shapes: ${sum2}`)

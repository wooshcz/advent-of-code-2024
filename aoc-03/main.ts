
import { readFileSync } from 'node:fs'

const file = readFileSync('./input.txt', 'utf-8')
const lines = file.split('\n')

let _sum = 0
for (const line of lines) {
    if (line.length == 0) continue
    const _matches = [...line.matchAll(/mul\((\d{1,3}),(\d{1,3})\)/dg)]
    // console.log(_matches)
    for (const _match of _matches) {
        _sum += (parseInt(_match[1]) * parseInt(_match[2]))
    }
}

console.log(`Sum of multiplications (part1): ${_sum}`)

let _sum2 = 0
let _skip = false
for (const line of lines) {
    if (line.length == 0) continue
    const _matches = [...line.matchAll(/do\(\)|don't\(\)|mul\((\d{1,3}),(\d{1,3})\)/dg)]
    // console.log(_matches)
    for (const _match of _matches) {
        if (_match[0] === "do()") {
            _skip = false
            continue
        }
        else if (_match[0] === "don't()") {
            _skip = true
            continue
        }
        if (_skip) {
            continue
        }
        _sum2 += (parseInt(_match[1]) * parseInt(_match[2]))
    }
}

console.log(`Sum of multiplications (part2): ${_sum2}`)
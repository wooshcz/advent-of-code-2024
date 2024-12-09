
import { readFileSync } from 'node:fs'

const file = readFileSync('./input.txt', 'utf-8').trim()
const lines = file.split('\n')
const enum Operator { Plus, Times }

function testCalculate(leftSide: number, operator: Operator, rightSide: number[], result: number): boolean {
    // console.log(leftSide, operator, rightSide, result)
    if (rightSide.length === 0) {
        return leftSide === result
    }
    let _tmp: number
    const right = rightSide.pop()
    // console.log(right)
    if (right !== undefined) {
        if (operator === Operator.Plus) {
            _tmp = leftSide + right
        } else if (operator === Operator.Times) {
            _tmp = leftSide * right
        } else {
            throw new Error()
        }
        if (_tmp !== undefined) {
            if (rightSide.length === 0) {
                return _tmp === result
            } else {
                const res1 = testCalculate(_tmp, Operator.Plus, [...rightSide], result)
                const res2 = testCalculate(_tmp, Operator.Times, [...rightSide], result)
                return (res1 || res2)
            }
        }
    }
    return false
}

let sum = 0
for (const line of lines) {
    const parts = line.split(" ")
    const result = parseInt(parts[0].slice(0, -1))
    const _slice = parts.slice(1, undefined)
    // console.log(`Result: ${result} | Slice: ${_slice}`)
    const slice = _slice.map((value) => parseInt(value)).toReversed()
    const leftSide = slice.pop()
    const slicecpy = [...slice]
    if (leftSide === undefined) throw new Error()
    if (testCalculate(leftSide, Operator.Plus, slice, result) === true ||
        testCalculate(leftSide, Operator.Times, slicecpy, result) === true) {
        sum += result
    }
}

console.log(`Part 1: What is their total calibration result? ${sum}`)
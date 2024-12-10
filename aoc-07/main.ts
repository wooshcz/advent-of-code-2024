
import { readFileSync } from 'node:fs'

const file = readFileSync('./input.txt', 'utf-8').trim()
const lines = file.split('\n')
const enum Operator { Plus, Times, Concat }

function testCalculate(leftSide: number | undefined, operator: Operator | undefined, rightSide: number[], result: number): boolean {
    // console.log(leftSide, operator, rightSide, result)
    if (rightSide.length === 0) {
        return leftSide === result
    }
    let _tmp: number
    const right = rightSide.pop()
    // console.log(right)
    if (right !== undefined) {
        if (leftSide === undefined) {
            _tmp = right
        } else if (operator === Operator.Plus) {
            _tmp = leftSide + right
        } else if (operator === Operator.Times) {
            _tmp = leftSide * right
        } else if (operator === Operator.Concat) {
            _tmp = parseInt(leftSide.toString() + right.toString())
        } else {
            throw new Error()
        }
        if (_tmp !== undefined) {
            if (rightSide.length === 0) {
                return _tmp === result
            } else {
                const res1 = testCalculate(_tmp, Operator.Plus, [...rightSide], result)
                const res2 = testCalculate(_tmp, Operator.Times, [...rightSide], result)
                const res3 = testCalculate(_tmp, Operator.Concat, [...rightSide], result)
                // console.log(res1, res2, res3)
                return (res1 || res2 || res3)
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
    const res = testCalculate(undefined, undefined, slice, result)
    if (res) {
        sum += result
    }
}

console.log(`What is their total calibration result? ${sum}`)
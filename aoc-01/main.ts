
import { readFileSync } from 'node:fs'

const file = readFileSync('./input.txt', 'utf-8')
const lines = file.split('\n')

interface LocationId {
    position: number,
    value: number,
}

const listLeft: LocationId[] = []
const listRight: LocationId[] = []

function _compareFnVal(a: LocationId, b: LocationId) {
    return a.value - b.value
}

function _compareFnPos(a: LocationId, b: LocationId) {
    return a.position - b.position
}

let counter = 0
for (const line of lines) {
    if (line.length == 0) continue
    const _arr = line.split(/\s+/g)
    const _val1: LocationId = { position: counter, value: parseInt(_arr[0]) }
    const _val2: LocationId = { position: counter, value: parseInt(_arr[1]) }
    listLeft.push(_val1)
    listRight.push(_val2)
    counter++
}

listLeft.sort(_compareFnVal)
listRight.sort(_compareFnVal)

// console.log(listLeft)
// console.log(listRight)

if (listLeft.length != listRight.length) throw Error("Lists are not the same length!")

let diffSum = 0
for (let i = 0; i < listLeft.length; i++) {
    const _diff = Math.abs(listLeft[i].value - listRight[i].value)
    diffSum += _diff
}

console.log(`Sum of differences is: ${diffSum}`);


listLeft.sort(_compareFnPos)
listRight.sort(_compareFnPos)

let diffScore = 0
for (const element of listLeft) {
    const _score = element.value * listRight.filter((value) => { return value.value == element.value }).length
    diffScore += _score
}

console.log(`Sum of the similarity scores is: ${diffScore}`);
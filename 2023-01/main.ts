import { readFileSync } from 'node:fs'

const file = readFileSync('./input.txt', 'utf-8')
const lines = file.split('\n')
let calValSum = 0

const digitMap = new Map<string, string>()
digitMap.set("one", "1")
digitMap.set("two", "2")
digitMap.set("three", "3")
digitMap.set("four", "4")
digitMap.set("five", "5")
digitMap.set("six", "6")
digitMap.set("seven", "7")
digitMap.set("eight", "8")
digitMap.set("nine", "9")


for (const line of lines) {
    if (line.length > 0) {
        const matches = line.matchAll(/(?=(\d|one|two|three|four|five|six|seven|eight|nine))/dg)
        const numbers: string[] = []
        for (const num of matches) {
            numbers.push(num[1])
        }
        console.log(`${numbers}`)
        if (numbers != null) {
            let first: string | undefined = numbers[0]
            let last: string | undefined = numbers[numbers.length - 1]
            if (first.length > 1) {
                first = digitMap.get(first)
            }
            if (last.length > 1) {
                last = digitMap.get(last)
            }
            if (first != undefined && last != undefined) {
                const calVal = parseInt(first + last)
                calValSum += calVal
                console.log(`${first} - ${last}: ${calVal}`)
            } else {
                throw Error("Error!")
            }
        }
    }
}
console.log(`Sum: ${calValSum}`)

import { readFileSync } from 'node:fs'

const file = readFileSync('./input.txt', 'utf-8').trim()
const lines = file.split('\n')

interface PageRule {
    before: string,
    after: string,
}

const ruleArray: PageRule[] = []
const updateArray: string[][] = []

for (const line of lines) {
    if (line.length === 5) {
        const _rule = line.split("|")
        ruleArray.push({ before: _rule[0], after: _rule[1] })
    } else if (line.length > 0) {
        const _update = line.split(",")
        updateArray.push(_update)
    }
}

// console.log(ruleArray)
// console.log(updateArray)

function getInvalidPages(update: string[]): string[] {
    const invalidPages: string[] = []
    for (let idx = 0; idx < update.length; idx++) {
        const page = update[idx]
        // console.log(`Processing page no ${page}`)
        const applicableRules = ruleArray.filter((value) => { return value.after === page || value.before === page })
        // console.log(applicableRules)
        const _leftPart = update.slice(undefined, idx + 1)
        const _rightPart = update.slice(idx + 1, undefined)
        for (const _rule of applicableRules) {
            if ((_rule.before === page && _leftPart.filter((value) => { return value === _rule.after }).length > 0)
                || (_rule.after === page && _rightPart.filter((value) => { return value === _rule.before }).length > 0)) {
                invalidPages.push(page)
                break
            }
        }
    }
    return invalidPages
}

export const mode = (arr: string[]): number[] => {
    const modes: number[] = [];
    const count: number[] = [];
    let maxValue = 0;
    let i;

    const list: number[] = arr.map((value) => parseInt(value))
    list.forEach((num, index) => {
        count[num] = (count[num] || 0) + 1;
        if (count[num] > maxValue) maxValue = count[num];
        i = index;
    });

    for (i in count) {
        // deno-lint-ignore no-prototype-builtins
        if (count.hasOwnProperty(i)) {
            if (count[i] === maxValue && maxValue > 1) {
                modes.push(Number(i));
            }
        }
    }
    return modes;
};


let sumValid = 0
let sumInvalid = 0
for (const update of updateArray) {
    const invalidPages = getInvalidPages(update)
    if (invalidPages.length === 0) {
        sumValid += parseInt(update[Math.floor(update.length / 2)])
    } else {
        // console.log(`Invaid update: ${update}`)
        const newupdate: string[] = []
        const applicableRules = ruleArray.filter((value) => { return update.includes(value.after) && update.includes(value.before) })
        // console.log(applicableRules)
        // console.log(`${applicableRules.length} / ${update.length}`)
        let beforeList = [], afterList = []
        for (const rule of applicableRules) {
            beforeList.push(rule.before)
            afterList.push(rule.after)
            // console.log(rule)
        }
        while (newupdate.length != update.length) {
            let next = ""
            if (beforeList.length === 1) {
                next = beforeList.pop() || ""
            } else if (beforeList.length === 0 && afterList.length > 0) {
                next = afterList.pop() || ""
            } else if (beforeList.length > 1) {
                next = mode(beforeList).toString()
            }
            newupdate.push(next)
            beforeList = beforeList.filter((value) => { return value != next })
            afterList = afterList.filter((value) => { return value != next })
        }
        // console.log(`New update: ${newupdate}`)
        if (getInvalidPages(newupdate).length === 0) {
            sumInvalid += parseInt(newupdate[Math.floor(newupdate.length / 2)])
        } else {
            throw new Error("Something went wrong!")
        }
    }
}


console.log(`Total sum of middle page number from valid updates: ${sumValid}`)
console.log(`Total sum of middle page number from invalid updates after reordering: ${sumInvalid}`)

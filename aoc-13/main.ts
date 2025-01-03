
import { readFileSync } from 'node:fs'

const file = readFileSync('./input.txt', 'utf-8').trim()

const A_PRICE = 3
const B_PRICE = 1

type Machine = {
    AXinc: number
    AYinc: number
    BXinc: number
    BYinc: number
    Xprize: number
    Yprize: number
}

const _matches = [...file.matchAll(/Button A: X\+(\d+), Y\+(\d+)\nButton B: X\+(\d+), Y\+(\d+)\nPrize: X=(\d+), Y=(\d+)/gm)]

let tokens = 0
for (const match of _matches) {
    const _machine = {
        AXinc: parseInt(match[1]),
        AYinc: parseInt(match[2]),
        BXinc: parseInt(match[3]),
        BYinc: parseInt(match[4]),
        Xprize: parseInt(match[5]),
        Yprize: parseInt(match[6])
    }
    const Bn: number = (_machine.Yprize * _machine.AXinc - _machine.Xprize * _machine.AYinc) / (_machine.BYinc * _machine.AXinc - _machine.BXinc * _machine.AYinc)
    // console.log(Bn)
    if (Bn.toFixed(0) === Bn.toString()) {
        const An: number = (_machine.Xprize - Bn * _machine.BXinc) / _machine.AXinc
        if (An <= 100 && Bn <= 100) {
            tokens += Bn * B_PRICE + An * A_PRICE
        }
    }
}

console.log(`What is the fewest tokens you would have to spend to win all possible prizes (part1)? ${tokens}`)


const PRIZE_INC = 10000000000000

let tokens2 = 0
for (const match of _matches) {
    const _machine = {
        AXinc: parseInt(match[1]),
        AYinc: parseInt(match[2]),
        BXinc: parseInt(match[3]),
        BYinc: parseInt(match[4]),
        Xprize: parseInt(match[5]) + PRIZE_INC,
        Yprize: parseInt(match[6]) + PRIZE_INC
    }
    const Bn: number = (_machine.Yprize * _machine.AXinc - _machine.Xprize * _machine.AYinc) / (_machine.BYinc * _machine.AXinc - _machine.BXinc * _machine.AYinc)
    // console.log(Bn)
    if (Bn.toFixed(0) === Bn.toString()) {
        const An: number = (_machine.Xprize - Bn * _machine.BXinc) / _machine.AXinc
        tokens2 += Bn * B_PRICE + An * A_PRICE
    }
}

console.log(`What is the fewest tokens you would have to spend to win all possible prizes (part2)? ${tokens2}`)

import { readFileSync } from 'node:fs'

const file = readFileSync('./input.txt', 'utf-8').trim()
const lines = file.split('\n')

const MAX_Y = lines.length - 1
const MAX_X = lines[0].length - 1

interface XYCoords {
    x: number,
    y: number,
}

class Region {
    plants: XYCoords[]
    letter: string

    constructor(letter: string, point: XYCoords) {
        this.letter = letter
        this.plants = [point]
    }

    calculatePerimeter(): number {
        let perimeter = 0
        for (const pl of this.plants) {
            const _tmp: XYCoords[] = regions.filter((val) => this.letter !== val.letter).flatMap((val) => val.plants)
            perimeter += _tmp.filter((val) => {
                return (val.x + 1 === pl.x && val.y === pl.y
                    || val.x - 1 === pl.x && val.y === pl.y
                    || val.x === pl.x && val.y + 1 === pl.y
                    || val.x === pl.x && val.y - 1 === pl.y)
            }).length
            if (pl.x === 0 || pl.x === MAX_X) perimeter += 1
            if (pl.y === 0 || pl.y === MAX_Y) perimeter += 1
        }
        return perimeter
    }

    getArea(): number {
        return this.plants.length
    }

    isNeighbor(field: XYCoords, letter: string): boolean {
        if (this.letter === letter && this.plants.filter((val) => {
            return (val.x + 1 === field.x && val.y === field.y
                || val.x - 1 === field.x && val.y === field.y
                || val.x === field.x && val.y + 1 === field.y
                || val.x === field.x && val.y - 1 === field.y)
        }).length > 0) return true
        else return false
    }
}

const regions: Region[] = []
let row = 0
for (const line of lines) {
    let col = 0
    for (const el of line) {
        const reg = regions.filter((val) => val.isNeighbor({ x: col, y: row }, el))
        if (reg.length === 1) {
            reg[0].plants.push({ x: col, y: row })
            // console.log(`New point added to ${JSON.stringify(reg[0].plants)}`)
        }
        else if (reg.length > 1) {
            reg[0].plants.push({ x: col, y: row })
            for (let c = 1; c < reg.length; c++) {
                reg[0].plants.push(...reg[c].plants)
                reg[c].plants = []
            }

        } else {
            regions.push(new Region(el, { x: col, y: row }))
        }
        col++
    }
    row++
}

const regions_merged = regions.filter((val) => val.plants.length !== 0)
// console.log(regions_merged)

let price = 0
for (const reg of regions_merged) {
    const _per = reg.calculatePerimeter()
    const _area = reg.getArea()
    const _price = _per * _area
    console.log(`Letter: ${reg.letter} Perimeter: ${_per} Area: ${_area} = Price: ${_price}`)
    price += _price
}

console.log(`What is the total price of fencing all regions on your map? ${price}`)

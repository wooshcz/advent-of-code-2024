
import { readFileSync } from 'node:fs'

const file = readFileSync('./input.txt', 'utf-8')
const lines = file.split('\n')
const maxDiff = 3


function generateReportVariants(report: string[]) {
    const reportVariants: string[][] = []
    reportVariants.push(report)
    for (let id = 0; id < report.length; id++) {
        reportVariants.push(report.filter((_value, index) => { return (index != id) }))
    }
    return reportVariants
}


function isReportSafe(report: string[]) {
    const reportVariants: string[][] = generateReportVariants(report)
    for (const report of reportVariants) {
        let _prev: number | undefined = undefined
        let _curr: number
        let _trend: number | undefined = undefined
        let _safe = 0
        for (const level of report) {
            _curr = parseInt(level)
            if (_prev === undefined) {
                _prev = _curr
                continue
            }
            if (_trend === undefined) {
                if (_curr > _prev) {
                    _trend = 1
                } else if (_curr < _prev) {
                    _trend = -1
                } else {
                    break
                }
            }
            if ((_curr - _prev) / _trend <= maxDiff && ((_curr - _prev) / (_trend) > 0)) {
                _safe += 1
                _prev = _curr
            } else {
                break
            }
            if (_safe == report.length - 1) {
                return true
            }
        }
    }
    return false
}

let safeReportsCounter = 0
for (const line of lines) {
    if (line.length == 0) continue
    const _levels = line.split(/\s+/g)
    // console.log(_levels)
    if (isReportSafe(_levels)) {
        safeReportsCounter += 1
    }
}

console.log(`Safe reports counter: ${safeReportsCounter}`)


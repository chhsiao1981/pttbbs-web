import { Component, LegacyRef, MouseEventHandler, createRef } from 'react'
import { TableData } from '../../types'

import { Cell } from 'fixed-data-table-2'

import styles from './ContentRenderer.module.css'
import Empty from '../Empty'

type Props = {
    data: TableData<any>
    rowIndex?: number
    fontSize: number
    columnKey?: string
    highlightRow: number
    setRowNum: any
    onClick: (data: TableData<any>, rowIndex: number, divRef: HTMLDivElement | null) => void
    onLeaveMore: () => void
}

export default class More extends Component<Props> {
    divRef = createRef<HTMLDivElement>()

    render() {
        const { data, rowIndex, fontSize, columnKey, highlightRow, setRowNum, onClick, onLeaveMore } = this.props

        let style: any = {
            display: 'block',
            height: '100%',
            fontSize: fontSize + 'px',
            cursor: 'pointer',
        }

        if (rowIndex !== highlightRow) {
            return (
                <Cell style={style}
                    onMouseEnter={() => setRowNum(rowIndex)}
                    onMouseLeave={() => setRowNum(-1)}>
                    <div className={styles['more']} style={style}></div>
                </Cell>
            )
        }

        style['backgroundColor'] = '#333'

        let onLeave = () => {
            console.log('More: onLeave: start')
            setRowNum(-1)
            if (onLeaveMore) {
                onLeaveMore()
            }
        }

        return (
            <Cell style={style}
                onMouseEnter={() => setRowNum(rowIndex)}
                onMouseLeave={onLeave}>
                <div ref={this.divRef} className={styles['more']} onClick={() => onClick(data, rowIndex, this.divRef.current)}>...</div>
            </Cell>
        )
    }
}

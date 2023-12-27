import { MouseEventHandler } from 'react'
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
    onClick: (data: TableData<any>, rowIndex: number) => void
}

export default (props: Props) => {
    const { data, rowIndex, fontSize, columnKey, highlightRow, setRowNum, onClick } = props

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

    return (
        <Cell style={style}
            onMouseEnter={() => setRowNum(rowIndex)}
            onMouseLeave={() => setRowNum(-1)}>
            <div className={styles['more']} onClick={() => onClick(data, rowIndex)}>...</div>
        </Cell>
    )
}

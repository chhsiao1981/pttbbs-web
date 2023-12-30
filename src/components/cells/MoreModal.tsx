import { CSSProperties, MouseEventHandler, ReactElement } from "react"
import Empty from "../Empty"
import { MoreInfo } from "./MoreInfo"
import styles from './MoreModal.module.css'
import { CONSTS } from "../utils"

type Props = {
    isDisplay: boolean
    x: number
    y: number
    more: Array<MoreInfo>
    onEnterMore: () => void
    onLeaveMore: () => void
}

export default (props: Props) => {
    const { isDisplay, x, y, more, onEnterMore, onLeaveMore } = props
    if (!isDisplay) {
        return <Empty />
    }

    let height = (more.length * CONSTS.LINE_HEIGHT + 5) + 'px'
    let style: CSSProperties = {
        top: (y + CONSTS.LINE_HEIGHT) + 'px',
        left: x + 'px',
        height: height,
        width: '150px',
        fontSize: CONSTS.FONT_SIZE,
    }

    let moreStyle: CSSProperties = {
        height: CONSTS.LINE_HEIGHT + 'px',
    }

    let renderMore = (more: MoreInfo, idx: number) => {
        return (
            <div key={'more-' + idx} className={styles['more']} style={moreStyle} onClick={more.action}>{more.name}</div>
        )
    }

    return (
        <div className={styles['moremodal']} style={style} onMouseEnter={onEnterMore} onMouseLeave={onLeaveMore}>
            {more.map((each, idx) => renderMore(each, idx))}
        </div>
    )
}

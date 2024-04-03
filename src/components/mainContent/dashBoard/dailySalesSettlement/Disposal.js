import React from 'react'
import SalesopDisposalComp from 'components/mainContent/reporting/reportTransaction/SalesopDisposal';

export default function Disposal({ ...props }) {
    return (
        <SalesopDisposalComp stylePading={'0 0 10px'} styleHeight={'auto'} isStore={props.isStore} />
    )
}

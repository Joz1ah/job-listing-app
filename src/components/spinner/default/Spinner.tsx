import { FC, ReactElement } from 'react'
import cn from 'classnames'

import styles from './spinner.module.scss'
import button_loading_spinner from 'assets/loading-spinner-orange.svg?url';

interface ISpinner {
  className?: string
}

const Spinner: FC<ISpinner> = ({ className }): ReactElement => (
    <img
    src={button_loading_spinner}
    alt="Loading"
    className={cn(className, styles['button-spinner'])}
    />
)

export { Spinner }

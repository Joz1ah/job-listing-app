import { FC, ReactElement, ReactNode, MouseEvent, memo } from 'react'
import cn from 'classnames'

import styles from './authnetForm.module.scss'

interface IForm {
  className?: string
  disabled?: boolean
  onClick?: (_e: MouseEvent<HTMLButtonElement>) => void
  type?: 'button' | 'submit' | 'reset'
  children?: ReactNode
}

const AuthnetPaymentForm: FC<IForm> = ({
  onClick,
  className,
  disabled = false,
  children,
  type = 'button'
}): ReactElement => (
  <button
    type={type}
    disabled={disabled}
    className={cn(styles.button, className)}
    onClick={onClick}
  >
    {children}
  </button>
)

const memorizedAuthnetPaymentForm: FC<IForm> = memo(AuthnetPaymentForm)

export { memorizedAuthnetPaymentForm as AuthnetPaymentForm }

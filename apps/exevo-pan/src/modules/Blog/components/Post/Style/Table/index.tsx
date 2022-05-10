import clsx from 'clsx'
import styles from './styles.module.css'

const table = (props: React.HTMLAttributes<HTMLTableElement>): JSX.Element => (
  <div className="custom-scrollbar mx-auto max-w-full overflow-auto rounded-t-md transition-colors">
    <table
      {...props}
      className={clsx(styles.table, 'max-w-full border-collapse')}
    />
  </div>
)

export default table

export default function Snackbar({ message, visible, type = 'success' }) {
  return (
    <div className={`snackbar snackbar--${type} ${visible ? 'snackbar--visible' : ''}`}>
      <i className={`fa-solid ${type === 'success' ? 'fa-circle-check' : type === 'error' ? 'fa-circle-xmark' : 'fa-circle-info'}`} />
      <span>{message}</span>
    </div>
  )
}

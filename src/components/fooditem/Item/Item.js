import './item.css'
function Item({classname, foodsrc, foodname }) {
  return (
    <div className={classname}>
      <div className="food-icon">{foodsrc}</div>
      <button>{foodname}</button>
    </div>
  );
}
export default Item
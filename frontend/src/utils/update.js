// import reverse from './reverse'

export default (comp) => {
  let poll = () => {
    console.log("setTimeout", comp.test);
    comp.test++;
    setTimeout(poll(), 5000);
  }
  poll();
}
1. What is the difference between getElementById, getElementsByClassName, and querySelector / querySelectorAll?
ans:
getElementById: grabs one element by its unique id.

getElementsByClassName: grabs a live collection of all elements with a class.

querySelector: grabs the first match for any CSS selector.

querySelectorAll: grabs all matches for any CSS selector (returns a static list).


2. How do you create and insert a new element into the DOM?
ans:
const div = document.createElement("div");
div.textContent = "Hello!";
document.body.appendChild(div);


3. What is Event Bubbling and how does it work?
ans:
Events start at the deepest element and bubble up through its parent elements. 
Example: a click on a button also "reaches" the div/container above it.


4. What is Event Delegation in JavaScript? Why is it useful?
ans:
Instead of adding a listener to many children, you attach one listener to a parent and check the target inside.
It saves memory, easier when new elements are added.


5. What is the difference between preventDefault() and stopPropagation() methods?
ans:
preventDefault(): stops the default action (e.g., form submit, link navigation).

stopPropagation(): stops the event from bubbling up to parent elements.
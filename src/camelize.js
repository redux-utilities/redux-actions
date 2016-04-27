// MY_CONSTANT_NAME => myConstantName
export default function(s) {
  return s.toLowerCase()
   .replace(/_\w/g, x => x[1].toUpperCase());
}

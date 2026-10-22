import Legal from './Legal.jsx';
import blocks from './terms.json';

export default function Terms() {
  return <Legal title="Terms & Conditions" blocks={blocks} />;
}

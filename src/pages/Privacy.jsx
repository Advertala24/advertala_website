import Legal from './Legal.jsx';
import blocks from './privacy.json';

export default function Privacy() {
  return <Legal title="Privacy Policy" blocks={blocks} />;
}

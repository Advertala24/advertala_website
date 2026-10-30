import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { parseListings, decodeEntities } from './xml.js';
import { beaconHtml } from './beacons.js';

// Real response sample from the partner (ClickUrls shortened).
const xml = fs.readFileSync(new URL('./fixtures/listings.xml', import.meta.url), 'utf8');

test('extracts beacon tokens', () => {
  const { tokens } = parseListings(xml);
  assert.deepEqual(tokens, {
    searchId: '0F98BDDLE8CAD',
    clientId: '59D18DCA6ABC445F9480467F5F851E39',
    impressionGuid: '645031F049B44D6B8C0B385379346326',
    rguid: '63d4b0dfa07b407ea7cce662d9b1278b',
  });
});

test('extracts all three listings despite non-well-formed XML', () => {
  const { ads } = parseListings(xml);
  assert.equal(ads.length, 3);
  assert.deepEqual(ads.map((a) => a.impressionId), ['79233779635660', '74079927916174', '79233752539267']);
  assert.equal(ads[1].appNs, 'API');
  assert.equal(ads[1].k, '5039');
  assert.equal(ads[1].metadata, 'e30%3D');
  assert.equal(ads[1].host, 'www.gulfshores.com');
  assert.equal(ads[1].title, 'Kid-Friendly Destinations - Best <b>Vacations</b> for Kids');
  assert.ok(ads[1].url.startsWith('https://rd.search.yahoo.com/rdclk/BBB'));
});

test('extracts related searches', () => {
  assert.deepEqual(parseListings(xml).suggestions.slice(0, 2), ['vacations', 'family cruises']);
});

test('decodes entities', () => {
  assert.equal(decodeEntities('a&mdash;b&rsquo;s &amp; &#39;c&#x27;'), "a—b’s & 'c'");
});

test('beacon escapes values', () => {
  const html = beaconHtml({ searchId: "a'b</script>", clientId: '', impressionGuid: '', rguid: '' }, 'tag');
  assert.ok(!html.includes("a'b</script>"));
});

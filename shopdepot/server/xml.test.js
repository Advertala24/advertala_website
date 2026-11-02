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

// Second real sample: well-formed XML with one- and two-level escaping and SiteLinks that nest <Url><Url>.
const subaru = fs.readFileSync(new URL('./fixtures/listings-subaru.xml', import.meta.url), 'utf8');

test('subaru sample: tokens and three ads, click url is the listing ClickUrl (not a sitelink)', () => {
  const { tokens, ads } = parseListings(subaru);
  assert.equal(tokens.searchId, '6S7KK51LEGG29');
  assert.equal(tokens.clientId, '0F952848A93842BC99B1771B0E4CEED9');
  assert.equal(tokens.impressionGuid, '645049C673A44BDA8E4993E2C5DB82AE');
  assert.equal(tokens.rguid, '3dda375eceee43e7b4683faad22d5e0a');
  assert.deepEqual(ads.map((a) => a.k), ['5036', '5049', '5061']);
  assert.deepEqual(ads.map((a) => a.url.split('/rdclk/')[1].split('/')[0]), ['MAIN1', 'MAIN2', 'MAIN3']);
});

test('subaru sample: escaped <b> becomes real tags; double escapes collapse', () => {
  const { ads } = parseListings(subaru);
  assert.equal(ads[0].description, 'Schedule a Test Drive in a New <b>Subaru</b> Today. Shop Our Fantastic Selection of Offers at West Houston <b>Subaru</b> Today');
  assert.equal(ads[1].title, '2026 MAZDA CX-30 - Explore Features & Options');
  assert.equal(ads[2].title, 'Shop <b>Subaru</b> At CarMax® - Find The Right <b>Subaru</b> For You');
  assert.equal(ads[2].host, 'www.carmax.com/Subarus');
});

test('markdown-mangled siteHost is unwrapped', () => {
  const x = '<Listing ImpressionId="1" siteHost="[www.a.com/x](https://www.a.com/x)" title="t" description="d"><ClickUrl>https://c</ClickUrl></Listing>';
  assert.equal(parseListings(x).ads[0].host, 'www.a.com/x');
});

test('subaru sample: sitelinks parsed per ad (desktop only UI)', () => {
  const { ads } = parseListings(subaru);
  assert.deepEqual(ads[0].siteLinks.map((l) => l.text), ['Schedule Service', 'About West Houston Subaru']);
  assert.equal(ads[0].siteLinks[0].url, 'https://rd.search.yahoo.com/rdclk/SITELINK1/RK=0/RS=s1-');
  assert.equal(ads[1].siteLinks.length, 1);
  assert.equal(ads[2].siteLinks.length, 0);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { parseListings } from './xml.js';
import { beaconHtml } from './beacons.js';

// Synthetic sample: the real schema is unconfirmed, this only exercises the parser.
const xml = `<Results SearchID="s1" ClientID="c1">
  <ImpressionGUID>g1</ImpressionGUID><RGUId>r1</RGUId>
  <Listing><ImpressionId>i1</ImpressionId><AppNs>ns</AppNs><K>kk</K><Metadata>md</Metadata>
    <Title>Cheap trips</Title><Description>Book now</Description><ClickUrl>https://e.com/?a=1&amp;b=2</ClickUrl><SiteHost>e.com</SiteHost></Listing>
</Results>`;

test('parses tokens and ads', () => {
  const { tokens, ads } = parseListings(xml);
  assert.deepEqual(tokens, { searchId: 's1', clientId: 'c1', impressionGuid: 'g1', rguid: 'r1' });
  assert.equal(ads.length, 1);
  assert.equal(ads[0].impressionId, 'i1');
  assert.equal(ads[0].url, 'https://e.com/?a=1&b=2');
});

test('beacon escapes values', () => {
  const html = beaconHtml({ searchId: "a'b</script>", clientId: '', impressionGuid: '', rguid: '' }, 'tag');
  assert.ok(!html.includes("a'b</script>"));
});
